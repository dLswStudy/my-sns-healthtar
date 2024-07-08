import {
    auth,
    signInWithEmailAndPassword
} from "@/firebase/firebase.client.config";

export async function POST(req: Request){
    const {email, password}= await req.json();
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return Response.json({message: `sign-in: ${email} successfully`});
    }catch (error){
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error,{status:500});
    }
}