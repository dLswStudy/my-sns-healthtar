import {signOut} from "firebase/auth";
import {auth} from "@/firebase/firebase.client.config";

export async function GET(req: Request) {
    try {
        await signOut(auth)
        return Response.json({message: "success signOut"}, {status: 200});
    }catch (error){
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error, {status: 500});
    }
}