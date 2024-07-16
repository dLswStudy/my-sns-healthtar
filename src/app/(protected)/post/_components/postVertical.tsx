import {Card} from "@/components/ui/card";
import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

type PostVerticalProps = {
    post: any
}
export default function PostVertical({ post}:PostVerticalProps) {
    return (
        <div className={'post-v'}>
            <Card className={'pCard border-gray-500'}>
                <div className="userInfo w-full flex items-center">
                    <Avatar>
                        <AvatarImage src={post.profile_image_url} alt={'Avatar'} width={35} height={35}
                                     className={'border-2'}/>
                        <AvatarFallback>USER</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">{post.nickname}</div>
                </div>
                <div className="p-3">{post.content}</div>
                <div className={'imageContainer'}>
                    <Image
                        src={post.main_photo_url}
                        alt={'Image'}
                        fill
                        style={{objectFit:'contain'}}
                        className={'image'}
                    />
                </div>
            </Card>
            <hr/>
        </div>
    );
}
