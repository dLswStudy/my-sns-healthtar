import {Checkbox} from "@/components/ui/checkbox";
import {Progress} from "@/components/ui/progress";
import {DetailPostModal} from "./_components/detailPostModal";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Image from "next/image";
import DotsMenuBtn from "@/app/(protected)/@modal/(.)post/detail/[postId]/_components/dotsMenuBtn";

type Props = {
    params: {
        postId: string
    }
}
export default async function PostDetail({params}: Props) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_DOMAIN}/api/post/getPost/${params.postId}`, { cache: 'no-store' });
    const data = await res.json();
    console.log("PostDetail main_photo_url = ", data.main_photo_url);

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
        </div>
    )

    const body = (
        <div className="modal-body">
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
            {
                data.progress_info_arr?.length ?
                <div className="mt-2 flex-wrap">
                    {
                        data.progress_info_arr.map((info) => (
                            <div className={'flex space-x-2 items-center'} key={'' + info.post_id}>
                                <div className={'flex items-center space-x-2'}>
                                    <Progress value={info.presentValue/info.goalValue*100} className={'w-40 border'}/>
                                    <p className="">{info.item} :{info.presentValue} → {info.goalValue} {info.unit}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
                :null
            }
        </div>
    )

    return (
        <DetailPostModal title={title}>{body}</DetailPostModal>
    );
}
