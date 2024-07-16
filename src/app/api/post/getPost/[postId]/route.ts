import {db} from "@/firebase/firebase.admin.config";

export async function GET(
    request: Request,
    { params }: { params: { postId: string } }
) {
    const postId = params.postId

    if (!postId) {
        return Response.json({messages:'Invalid postId'}, {status: 400});
    }

    try {
        const postRef = db.collection('POSTS').doc(postId);
        const doc = await postRef.get();

        if (!doc.exists) {
            return Response.json({messages:'post not found'}, {status: 404});
        }

        const postData = doc.data();
        return Response.json(postData, {status: 200});
    } catch (error){
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error, {status: 500});
    }

}