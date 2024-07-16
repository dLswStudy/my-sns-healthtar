import { PostAddSchema} from "@/lib/schemas";
import {firestore} from "@/firebase/firebase.client.config";
import moment from "moment";
import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {uploadImage} from "@/lib/utils";
import {postImgMiddlePath} from "@/stores/store.config";

async function getLastSeq(collectionName, seqName) {
    const seqDocRef = doc(firestore, "SEQ", collectionName);
    const docSnap = await getDoc(seqDocRef);
    const nowSeq = docSnap.data()?.[seqName];
    await updateDoc(seqDocRef, {[seqName]: nowSeq + 1});
    return nowSeq
}

export async function addPost(postToAdd:PostAddSchema, imageFile:File){
    const data = {
        ...postToAdd,
        createdAt: moment().format('YYYYMMDDHHmmSS'),
        updatedAt: moment().format('YYYYMMDDHHmmSS'),
    }
    let mainPhotoUrl;

    try {
        if(postToAdd.main_photo_url){
            mainPhotoUrl = await uploadImage(imageFile, postImgMiddlePath, postToAdd.user_seq+moment().format('YYYYMMDDHHmmSS'))
            data.main_photo_url = mainPhotoUrl
        }
        const post_seq = await getLastSeq('POSTS','post_seq');
        const docRef = doc(firestore, 'POSTS', ''+post_seq);
        await setDoc(docRef, data);
        return {ok:true, message: `Document added with user_seq: ${data.user_seq}`}
    } catch (error) {
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return {error};
    }
}