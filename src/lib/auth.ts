import {useEffect, useState} from "react";
import {
    browserLocalPersistence,
    browserSessionPersistence,
    onAuthStateChanged,
    sendSignInLinkToEmail,
    setPersistence,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
} from "firebase/auth";

import {
    actionCodeSettings,
    auth,
    createUserWithEmailAndPassword,
    firestore,
    sendEmailVerification
} from "@/firebase/firebase.client.config";
import {collection, doc, getDoc, getDocs, query, setDoc, where} from "@firebase/firestore";
import userStore from "@/stores/client/userStore";
import {signupSchemaV2} from "@/app/(public)/signUp/_component/signupForm";
import {updateDoc} from "firebase/firestore";
import moment from "moment/moment";
import {generateTemporaryPassword} from "@/lib/utils";
import {SetFirestoreUser, userProfilePageSchema} from "@/lib/schemas";

export async function signUp(data: signupSchemaV2, setFirestoreUser: SetFirestoreUser) {
    try {
        await setPersistence(auth, data.rememberMe ? browserLocalPersistence : browserSessionPersistence)
        const seqDocRef = doc(firestore, "SEQ",'USERS');
        const docSnap = await getDoc(seqDocRef);
        const userSeq = docSnap.data()?.user_seq;
        await updateDoc(seqDocRef, {user_seq: userSeq + 1});
        const newData = {
            email: data.email,
            seq: userSeq,
            helloword:data.helloword,
            birth: data.birth,
            followers: [],
            followings: [],
            gender:data.gender,
            name:data.name,
            nickname:data.nickName,
            profile_image_url:data.profileImageUrl,
            createdAt: moment().format('YYYYDDMMHHmmSS'),
            updatedAt: moment().format('YYYYDDMMHHmmSS'),

        };
        setFirestoreUser(newData)
        const userDocRef = doc(firestore,"USERS",data.email);
        await createUserWithEmailAndPassword(auth, data.email, data.password)
        console.log("createUser - auth.currentUser = ", Boolean(auth.currentUser));
        await setDoc(userDocRef,newData);
        return Response.json({message: 'User registered successfully'}, {status: 200});
    } catch (error) {
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error, {status: 500});
    }
}

export async function signIn(email: string, password: string, rememberMe: boolean = false, setFirestoreUser) {
    try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        const userDocRef = doc(firestore, "USERS", email)
        const userDocSnap = await getDoc(userDocRef);
        if(userDocSnap.exists()){
            await setFirestoreUser(userDocSnap.data())
        }else
            throw new Error("user not found")
        await signInWithEmailAndPassword(auth, email, password);
        const message = `sign-in: ${email} successfully`;
        console.log(message)
        return Response.json(message)
    } catch (error) {
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error, {status: 500});
    }
}

export async function signOut() {
    try {
        const message = `sign-out: ${auth.currentUser.email} successfully`;
        await firebaseSignOut(auth);
        console.log(message)
        return Response.json(message)
    } catch (error) {
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error, {status: 500});
    }
}

export function useUser(location) {
    const {authUser, setAuthUser} = userStore()
    const [ loading, setLoading ] = useState( true );

    useEffect(() => {
        console.log(`[${location}] authUser = `, authUser);
        return onAuthStateChanged(auth, (user) => {
            console.log(`[${location}] onAuthStateChanged user = `, user);
            if(Boolean(authUser) != Boolean(user)){
                console.log(`[${location}] before after not Equal`)
                setAuthUser(user)
            }else{
                console.log(`[${location}] before after Equal`)
            }
            setLoading(false)
        });
    }, []);

    return {authUser, loading};
}

export async function getUserByNickname(nickname:string):Promise<userProfilePageSchema>{
    console.log('%cgetUserByNickname',"color:cyan")
    try {
        const q = query(collection(firestore, 'USERS'), where('nickname', '==', nickname));
        const querySnapshot = await getDocs(q);

        // 쿼리 결과 처리
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data()
            return {
                seq: data.seq,
                name: data.name,
                email: doc.id,
                nickname: data.nickname,
                profile_image_url: data.profile_image_url,
                gender: data.gender,
                helloword: data.helloword,
                birth: data.birth,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                posts: data.posts?.length || 0,
                followers: data.followers?.length || 0,
                followings: data.followings?.length || 0,
                present: {
                    img: data.present?.img || '',
                    content: data.present?.content || '',
                    value_arr: data.present?.value_arr || [],
                },
                goal: {
                    img: data.goal?.img || '',
                    content: data.goal?.content || '',
                    value_arr: data.goal?.value_arr || [],
                },
                item_unit_arr: data.item_unit_arr || [],
                ids:{
                    itemAndUnit: data.ids?.itemAndUnit || 0,
                }
            }
        } else {
            console.log('No matching documents.');
            return null
        }
    } catch (error) {
        console.log('Error finding user by nickname: ', error);
        return null
    }
}

export async function authVerifyEmail(email, password?) {
    const docRef = doc(firestore, 'USERS', email);
    if (docRef) {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return Response.json({message: '이미 등록되어 있는 이메일 주소 입니다.'}, {status: 409})
    }
    try {
        let pw = password;
        if (!pw) pw = generateTemporaryPassword(12)
        await setDoc(docRef, {tempPw: pw});
        await createUserWithEmailAndPassword(auth, email, pw);
        await signInWithEmailAndPassword(auth, email, pw);
        const currtUser = auth.currentUser;
        await sendEmailVerification(currtUser)
        console.log("after sendEmailVerifi => auth.currentUser = ", Boolean(auth.currentUser));
        // await deleteUser(currtUser)
        return Response.json({message: 'send verifyEmail successfully'});
    } catch (error) {
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error, {status: 500});
    }
}


export async function GET(req: Request) {
    try {
        const currtUser = auth.currentUser;
        let password = ''
        if(currtUser){
            const docRef = doc(firestore, 'USERS', currtUser.email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists())
                password = docSnap.data().tempPw
            await signInWithEmailAndPassword(auth, currtUser.email, password);
            const emailVerified = currtUser.emailVerified;
            return Response.json({emailVerified})
        }else {
            return Response.json({message: 'currtUser 없음'},{status: 404})
        }
    }catch (error){
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error,{status:500});
    }
}

export async function authSendSignInLinkToEmail(email) {
    try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings)
        return Response.json({message: 'SendSignInLinkToEmail successfully'}, {status: 200});
    } catch (error) {
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error, {status: 500});
    }
}