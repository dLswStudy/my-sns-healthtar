import {Card} from "@/components/ui/card";
import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import moment from "moment/moment";

type PostVerticalProps = {
    post: any
}
export default function PostVertical({ post}:PostVerticalProps) {
    return (
        <div className={'post-v'}>
            <Card className={'pCard border-gray-300'}>
                <div className="userInfo w-full flex items-center">
                    <Avatar>
                        <AvatarImage src={post.profile_image_url} alt={'Avatar'} width={35} height={35}
                                     className={'border-2'}/>
                        <AvatarFallback>USER</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">{post.nickname}</div>
                </div>
                <div
                    className="post-h__time text-sm text-gray-500">{moment(post.createdAt, 'YYYYMMDDHHmmss').format('YYYY년 MM월 DD일 HH:mm:SS')}</div>
                <div className="p-[0.75em]">
                    <div className={'contentArea'}>
                        {post.content}
                    </div>
                </div>
                {
                    post.main_photo_url &&
                    <div className={'imageContainer'}>
                        <Image
                            src={post.main_photo_url}
                            alt={'Image'}
                            fill
                            style={{objectFit: 'contain'}}
                            className={'image'}
                        />
                    </div>
                }
            </Card>
        </div>
    );
}
