import {auth} from "@/firebase/firebase.client.config";

export async function GET(req: Request) {
    const currtUser = auth.currentUser;
    if(currtUser){
        const emailVerified = currtUser.emailVerified;
        return Response.json({emailVerified})
    }else {
        return Response.json({message: 'currtUser 없음'},{status: 404})
    }
}