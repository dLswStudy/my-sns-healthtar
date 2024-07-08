import {generateTemporaryPassword} from "@/lib/utils";
import {auth, createUserWithEmailAndPassword} from "@/firebase/firebase.client.config";

export async function POST(req: Request){
    const {email,password}= await req.json();
    try {
        let pw = password
        if(!pw)
            pw = generateTemporaryPassword(12)
        await createUserWithEmailAndPassword(auth, email, pw);
        return Response.json({message: 'createUser successfully'});
    }catch (error){
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error,{status:500});
    }
}