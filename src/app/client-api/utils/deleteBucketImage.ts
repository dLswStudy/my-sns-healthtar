import {bucketName} from "@/stores/store.config";
import {storage} from "@/firebase/firebase.client.config";
import {deleteObject, ref} from "@firebase/storage";


export async function deleteBucketImage(imageUrl) {
    try {
        // 이미지 URL에서 파일 경로 추출
        const filePath = imageUrl.split(`https://firebasestorage.googleapis.com/v0/b/my-sns-healthtar.appspot.com/o/`)[1]?.split('?')[0];

        if (!filePath) {
            throw new Error('Invalid image URL');
        }

        // 파일 경로 디코딩
        const decodedFilePath = decodeURIComponent(filePath);
        console.log("decodedFilePath = ", decodedFilePath);
        // Firebase Storage 레퍼런스를 생성하고 파일 삭제
        const fileRef = ref(storage, decodedFilePath);
        await deleteObject(fileRef);

        return {ok: true, message: `File deleted successfully:  ${filePath}`}
    } catch (error) {
        console.log(`ErrorName: ${error.name}`);
        console.log(`ErrorMessage: ${error.message}`);
        throw new Error(error);
    }
}
