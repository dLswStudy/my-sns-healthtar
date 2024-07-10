import {auth, firestore, signInWithEmailAndPassword} from "@/firebase/firebase.client.config";
import {doc, getDoc} from "firebase/firestore";

export async function chkEmailVerified() {
    try {
        const currtUser = auth.currentUser;
        console.log("chkEmailVerified - currtUser = ", Boolean(currtUser));
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