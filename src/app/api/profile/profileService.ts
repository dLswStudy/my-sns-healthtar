import {UserProfileImagesSchema, userProfilePageSchema} from "@/lib/schemas";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {firestore} from "@/firebase/firebase.client.config";
import moment from "moment";
import {uploadImage} from "@/lib/utils";
import {goalImgMiddlePath, presentImgMiddlePath, profileImgMiddlePath} from "@/stores/store.config";

export async function setProfile(profile:userProfilePageSchema,images:UserProfileImagesSchema, setFirestoreUser:any){
    console.log('setProfile')
    console.log("images = ", images);
    const {posts,followers, followings,createdAt,...toApply} = profile
    const uploadData = JSON.parse(JSON.stringify(toApply))
    uploadData.updatedAt = moment().format('YYYYMMDDHHmmSS')
    const docRef = doc(firestore, 'USERS', toApply.email);
    try {
        let profileImgUrl
        let presentImgUrl
        let goalImgUrl
        if(images.profile_img_file){
            profileImgUrl = await uploadImage(images.profile_img_file, profileImgMiddlePath, profile.nickname+moment().format('YYYYMMDDHHmmSS'))
            uploadData.profile_image_url = profileImgUrl
        }
        if(images.present_img_file){
            presentImgUrl = await uploadImage(images.present_img_file, presentImgMiddlePath, profile.nickname+moment().format('YYYYMMDDHHmmSS'))
            uploadData.present.img = presentImgUrl
        }
        if(images.goal_img_file){
            goalImgUrl = await uploadImage(images.goal_img_file, goalImgMiddlePath, profile.nickname+moment().format('YYYYMMDDHHmmSS'))
            uploadData.goal.img = goalImgUrl
        }
        await setDoc(docRef, uploadData, { merge: true }); // merge 옵션을 사용하여 기존 필드는 유지
        const doc = await getDoc(docRef)
        await setFirestoreUser(doc.data())
        console.log('Document upserted with ID: ', uploadData.email);
        return Response.json({message: `Document upserted with ID: ${docRef.id}`});
    } catch (error) {
        console.error('Error upserting document: ', error);
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error, {status: 500});
    }
}