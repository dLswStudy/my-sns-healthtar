import {deleteUser} from "firebase/auth";
import {auth} from "@/firebase/firebase.client.config";

export async function GET(req: Request) {
    const user = auth.currentUser;
    try {
        if(user){
            await deleteUser(user)
            return Response.json({message: "success deleteUser"}, {status: 200});
        }else{
            return Response.json({message: "currtUser 없음"}, {status: 404});
        }
    }catch (error){
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error, {status: 500});
    }
}