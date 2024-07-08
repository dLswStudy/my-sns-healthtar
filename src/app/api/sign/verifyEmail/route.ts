import {generateTemporaryPassword} from "@/lib/utils";
import {
    auth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword
} from "@/firebase/firebase.client.config";
import {firestore} from "@/firebase/firebase.client.config";
import {doc, getDoc, setDoc} from "@firebase/firestore";

export async function POST(req: Request) {
    const {email, password} = await req.json();
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
        // await deleteUser(currtUser)
        return Response.json({message: 'send verifyEmail successfully'});
    } catch (error) {
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error, {status: 500});
    }
}
