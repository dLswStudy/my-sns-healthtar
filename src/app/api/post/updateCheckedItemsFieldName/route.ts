import {db} from "@/firebase/firebase.admin.config";
import admin from "firebase-admin"

export async function GET(){
    try {
        const postsSnapshot = await db.collection('POSTS').get();
        const batch = db.batch();

        postsSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.checked_items !== undefined) {
                batch.update(doc.ref, {
                    checked_ids: data.checked_items,
                    checked_items: admin.firestore.FieldValue.delete(),
                });
            }
        });

        await batch.commit();
        return Response.json({message: 'Field names updated successfully.'}, {status: 200});
    } catch (error) {
        return Response.json(error, {status: 500});
    }
}