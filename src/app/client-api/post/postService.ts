import { PostAddSchema} from "@/lib/schemas";
import {firestore} from "@/firebase/firebase.client.config";
import moment from "moment";
import {getDocs,where, collection, query, doc, getDoc, limit, orderBy, setDoc, startAfter, updateDoc} from "firebase/firestore";
import {uploadImage} from "@/lib/utils";
import {postImgMiddlePath} from "@/stores/store.config";
import {deleteDoc} from "@firebase/firestore";
import {deleteBucketImage} from "@/app/client-api/utils/deleteBucketImage";

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
        createdAt: moment().format('YYYYMMDDHHmmss'),
        updatedAt: moment().format('YYYYMMDDHHmmss'),
    }
    let mainPhotoUrl;

    try {
        if(postToAdd.main_photo_url){
            mainPhotoUrl = await uploadImage(imageFile, postImgMiddlePath, postToAdd.user_seq+moment().format('YYYYMMDDHHmmss'))
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

export async function putPost(postToAdd:PostAddSchema, imageFile:File){
    const data = {
        ...postToAdd,
        createdAt: moment().format('YYYYMMDDHHmmss'),
        updatedAt: moment().format('YYYYMMDDHHmmss'),
    }
    let mainPhotoUrl;

    try {
        if(postToAdd.main_photo_url){
            mainPhotoUrl = await uploadImage(imageFile, postImgMiddlePath, postToAdd.user_seq+moment().format('YYYYMMDDHHmmss'))
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


export async function getPosts(lastVisiblePost = null, pageSize = 10) {
    let q = query(
        collection(firestore, 'POSTS'),
        orderBy('createdAt', 'desc'),
        limit(pageSize));
    if (lastVisiblePost) {
        q = query(
            collection(firestore, 'POSTS'),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisiblePost),
            limit(pageSize));
    }

    const querySnapshot = await getDocs(q);
    const posts = [];
    for (const docm of querySnapshot.docs) {
        const postData = docm.data();
        const user_seq = postData.user_seq
        // Get user data
        const userQ = query(collection(firestore, 'USERS'), where('seq', '==', user_seq));
        const userQuerySnapshot = await getDocs(userQ);
        const userData = userQuerySnapshot.docs[0]?.data();

        if (userData) {
            postData.profile_image_url = userData.profile_image_url;
            postData.nickname = userData.nickname;
        }

        posts.push({ id: docm.id, ...postData });
    }
    console.log("posts = ", posts);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { posts, lastVisible };
}

export async function getMyPosts(user_seq:number, lastVisiblePost = null, pageSize = 10) {
    console.log('%cgetMyPosts',"color:cyan",user_seq)
    let q = query(
        collection(firestore, 'POSTS'), 
        where('user_seq', 'in', [user_seq]),
        limit(pageSize));
    console.log("q = ", q);

    if (lastVisiblePost) {
        q = query(
            collection(firestore, 'POSTS'),
            where('user_seq', 'in', [user_seq]),
            startAfter(lastVisiblePost),
            limit(pageSize));
    }

    const querySnapshot = await getDocs(q);
    console.log("getMyPosts querySnapshot.docs = ", querySnapshot.docs);
    const posts = [];

    for (const docm of querySnapshot.docs) {
        const postData = docm.data();

        // Get user data
        const userQ = query(collection(firestore, 'USERS'), where('seq', '==', user_seq));
        const userQuerySnapshot = await getDocs(userQ);
        const userData = userQuerySnapshot.docs[0]?.data();

        if (userData) {
            postData.profile_image_url = userData.profile_image_url;
            postData.nickname = userData.nickname;
        }

        posts.push({ id: docm.id, ...postData });
    }
    console.log("getMyPosts posts = ", posts);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { posts, lastVisible };
}

export async function removePost(postId:string, imgUrl:string) {
    console.log("removePost imgUrl = ", imgUrl);
    const postRef = doc(firestore, 'POSTS', postId);
    try {
        await deleteBucketImage(imgUrl)
        await deleteDoc(postRef);
        return {ok:true, message: `Document deleted with ID: ${postId}`}
    } catch (error) {
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return {error};
    }
}