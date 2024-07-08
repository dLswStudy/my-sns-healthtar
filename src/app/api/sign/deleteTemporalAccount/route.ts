import {auth} from "@/firebase/firebase.client.config";
import {deleteUser, signInWithEmailAndPassword} from "firebase/auth";
import {firestore} from "@/firebase/firebase.client.config";
import {deleteDoc, doc, getDoc} from "@firebase/firestore";

export async function GET(req: Request) {
    try {
        const currtUser = auth.currentUser;
        if(currtUser){
            const docRef = doc(firestore, 'USERS', currtUser.email);
            const docSnap = await getDoc(docRef);
            const tempPw = docSnap?.data()?.tempPw;
            if(tempPw){
                await deleteDoc(docRef);
                await deleteUser(currtUser)
                return Response.json({message: 'Success to Delete TemporalAccount'})
            }
        }
        return Response.json({message: 'There is no to Delete TemporalAccount'})
    }catch (error){
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error,{status:500});
    }
}