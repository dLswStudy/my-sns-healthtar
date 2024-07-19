import {db} from "@/firebase/firebase.admin.config";
import {PostDetailSchema, PostPutSchema} from "@/lib/schemas";

export async function GET(
    request: Request,
    { params }: { params: { postId: string } }
) {
    const postId = params.postId
    console.log("getPost postId = ", postId);
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

        const result:PostPutSchema = {
            post_id:doc.id,
            user_seq:postData.user_seq,
            content:postData.content,
            main_photo_url:postData.main_photo_url,
            checked_ids:postData.checked_ids,
        }
        return Response.json(result, {status: 200});
    } catch (error){
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error, {status: 500});
    }

}