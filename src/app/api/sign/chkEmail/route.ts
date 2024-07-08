import {auth} from "@/firebase/firebase.client.config";

export async function GET(req: Request) {
    const currtUser = auth.currentUser;
    if(currtUser){
        const email = currtUser.email;
        return Response.json({email})
    }else {
        return Response.json({message: 'currtUser 없음'},{status: 404})
    }
}