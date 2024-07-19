import {db} from "@/firebase/firebase.admin.config";
import {PostDetailSchema} from "@/lib/schemas";

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

        const userQuery = db.collection('USERS').where('seq', '==', postData.user_seq);
        const querySnapshot = await userQuery.get();

        if (querySnapshot.empty) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        const checkedIds = postData.checked_ids;
        let chkCnt = Object.values(checkedIds).filter(value => value === true).length

        const progress_info_arr = []
        if(chkCnt>0){
            const present_value_arr = userData.present.value_arr;
            const goal_value_arr = userData.goal.value_arr;
            const item_unit_arr = userData.item_unit_arr;

            for (const id in checkedIds) {
                const progressInfo = {
                    post_id:id,
                    item:'',
                    goalValue:0,
                    presentValue:0,
                    unit:''
                }
                if(checkedIds[id]){
                    for (const el of item_unit_arr) {
                        if(el.id == id){
                            progressInfo.item = el.item
                            progressInfo.unit = el.unit
                            break
                        }
                    }
                    for (const el of present_value_arr) {
                        if(el.id == id){
                            progressInfo.presentValue = el.value
                            break
                        }
                    }
                    for (const el of goal_value_arr) {
                        if(el.id == id){
                            progressInfo.goalValue = el.value
                            break
                        }
                    }
                    progress_info_arr.push(progressInfo)
                }
            }
        }

        const result:PostDetailSchema = {
            progress_info_arr:progress_info_arr,
            post_id:postData.post_id,
            user_seq:postData.user_seq,
            content:postData.content,
            main_photo_url:postData.main_photo_url,
            hearts:postData.hearts,
            comments:postData.comments,
            createdAt:postData.createdAt,
            updatedAt:postData.updatedAt,
            nickname:userData.nickname,
            profile_image_url:userData.profile_image_url,
        }
        return Response.json(result, {status: 200});
    } catch (error){
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error, {status: 500});
    }

}