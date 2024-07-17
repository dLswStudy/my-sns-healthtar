import {DetailPostModal} from "./_components/detailPostModal";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Image from "next/image";
import DotsMenuBtn from "@/app/(protected)/@modal/(.)post/detail/[postId]/_components/dotsMenuBtn";

type Props = {
    params:{
        postId:string
    }
}
export default async function PostDetail({params}:Props){
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_DOMAIN}/api/post/getPost/${params.postId}`);
    const data = await res.json();

    const title = (
        <div className="modal-header w-full flex items-center justify-between">
            <div className="userInfo flex">
                <Avatar>
                    <AvatarImage src={data['profile_image_url']} alt={'Avatar'} width={35} height={35}
                                 className={'border-2'}/>
                    <AvatarFallback>USER</AvatarFallback>
                </Avatar>
                <div className="ml-2">{data['nickname']}</div>
            </div>
            <div className="relative">
                <DotsMenuBtn user_seq={data['user_seq']} postId={params.postId}/>
            </div>
        </div>
    )
    const body = (
        <div className={'post-v'}>
            <div className="p-3">{data.content}</div>
            {
                data.main_photo_url &&
                <div className={'imageContainer'}>
                    <Image
                        src={data.main_photo_url}
                        alt={'Image'}
                        fill
                        style={{objectFit: 'contain'}}
                    />
                </div>
            }
        </div>
)

    return (
        <DetailPostModal title={title}>{body}</DetailPostModal>
        // <DetailPostModal postId={params.postId}></DetailPostModal>
    );
}
