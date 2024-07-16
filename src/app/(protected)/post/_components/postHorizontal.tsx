import {Card} from "@/components/ui/card";
import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";

type PostVerticalProps = {
    post: any
    visibleUserInfo?: boolean
}
export default function PostHorizontal({ post, visibleUserInfo=false}:PostVerticalProps) {
    const containerRef = useRef(null);
    const [height, setHeight] = useState(0);
    const router = useRouter()

    useEffect(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            setHeight(containerWidth / 5);
        }

        const handleResize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                setHeight(containerWidth / 5);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const moveDetail = () => {
    }

    return (
        <div className={'post-h'}>
            <Card className={'pCard'} onClick={moveDetail}>
                {visibleUserInfo &&
                    <div className="userInfo w-full flex items-center">
                        <Avatar>
                            <AvatarImage src={post.profile_image_url} alt={'Avatar'} width={35} height={35} className={'border-2'}/>
                            <AvatarFallback>USER</AvatarFallback>
                        </Avatar>
                        <div className="ml-2">{post.nickname}</div>
                    </div>
                }
                <div ref={containerRef} className="flex w-full">
                    <div
                        className="contentArea border-gray-500 flex items-center justify-center"
                        style={{width: '80%', height: `${height}px`}}
                    >
                        {post.content}
                    </div>
                    <div
                        className="imageContainer relative"
                        style={{width: '20%', height: `${height}px`}}
                    >
                        <Image
                            src={post.main_photo_url}
                            alt="Image"
                            layout="fill"
                            objectFit="contain"
                            className="image"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
