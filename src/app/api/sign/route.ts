import {auth, firestore} from "@/firebase/firebase.client.config";
import {signInWithEmailAndPassword, signOut, updatePassword} from 'firebase/auth'
import {signupSchemaV2} from "@/app/(public)/signUp/_component/signupForm";
import moment from "moment";
import {doc, getDoc, updateDoc} from "@firebase/firestore";
import {loginSchemaV2} from "@/app/(public)/signIn/form/page";

export async function POST(req: Request) {
    const data = await req.json();
    console.log("data = ", data);
    switch (data.action) {
        case 'up':
            return await signUp(data);
        case 'in':
            return await signIn(data);
        // case 'out':
        //     await signOutUser(req);
        //     break;
        default:
            console.log('default')
            return Response.json({message: 'Requested action not found'});
    }
}

async function signUp(data: signupSchemaV2) {
    try {
        const seqDocRef = doc(firestore, "SEQ",'USERS');
        const docSnap = await getDoc(seqDocRef);
        const userSeq = docSnap.data()?.user_seq;
        await updateDoc(seqDocRef, {user_seq: userSeq + 1});
        const newData = {
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
        const userDocRef = doc(firestore,"USERS",data.email);
        await updatePassword(auth.currentUser, data.password)
        await updateDoc(userDocRef,{...newData,tempPw:''});
        await signOut(auth)
        return Response.json({message: 'User registered successfully'}, {status: 200});
    } catch (error) {
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error, {status: 500});
    }
}

async function signIn(data: loginSchemaV2) {
    const {email, password} = data;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        const message = `sign-in: ${email} successfully`;
        console.log(message)
        return Response.json(message)
    } catch (error) {
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error,{status:500});
    }
}

//
// async function signOutUser(req: NextApiRequest, res: NextApiResponse) {
//     try {
//         await signOut(auth);
//         res.status(200).json({message: 'User signed out successfully'});
//     } catch (error) {
//         res.status(500).json({error: error.message});
//     }
// }
//
// async function sendEmailVerification(user) {
//     const actionCodeSettings = {
//         url: 'http://localhost:3000/verified',
//         handleCodeInApp: true
//     };
//     await sendSignInLinkToEmail(auth, user.email, actionCodeSettings);
// }

export async function GET(req: Request) {
    const currtUser = auth.currentUser;
    if (currtUser) {
        const email = currtUser.email;
        return Response.json({email})
    } else {
        return Response.json({message: 'currtUser 없음'}, {status: 500})
    }
}