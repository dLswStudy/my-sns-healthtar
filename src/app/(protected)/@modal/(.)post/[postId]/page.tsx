import {DetailPostModal} from "./detailPostModal";
import Portal from "@/app/_component/Potal";

type Props = {
    params:{
        postId:string
    }
}
export default function PostDetail({params}:Props) {
    console.log("PostDetail111 = ",params.postId);
    return (
        <DetailPostModal>{params.postId}</DetailPostModal>
        // <DetailPostModal postId={params.postId}></DetailPostModal>
    );
}
