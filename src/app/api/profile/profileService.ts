import {userProfilePageSchema} from "@/lib/schemas";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {firestore} from "@/firebase/firebase.client.config";
import moment from "moment";

export async function setProfile(profile:userProfilePageSchema, setFirestoreUser){
    console.log('%csetProfile',"color:blue")
    const {posts,followers, followings,createdAt,...toApply} = profile
    console.log("toApply.email = ", toApply.email);
    toApply.updatedAt = moment().format('YYYYMMDDHHmmSS')
    const docRef = doc(firestore, 'USERS', toApply.email);
    try {
        await setDoc(docRef, toApply, { merge: true }); // merge 옵션을 사용하여 기존 필드는 유지
        const doc = await getDoc(docRef)
        await setFirestoreUser(doc.data())
        console.log('Document upserted with ID: ', toApply.email);
        return Response.json({message: `Document upserted with ID: ${docRef.id}`});
    } catch (error) {
        console.error('Error upserting document: ', error);
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        return Response.json(error, {status: 500});
    }
}