import {Card} from "@/components/ui/card";
import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import styled from 'styled-components';
import moment from "moment";


type PostVerticalProps = {
    post: any
    visibleUserInfo?: boolean
}
let line = 7
const maxHeight = `${1.5*(line+1)}em`
let StDiv = styled.div`
        -webkit-line-clamp: ${line};
    `;

export default function PostHorizontal({ post, visibleUserInfo=false}:PostVerticalProps) {
    console.log("PostHorizontal post = ", post);
    const textContainerRef = useRef(null);
    const [height, setHeight] = useState(0);
    const router = useRouter()


    useEffect(() => {
        const handleResize = () => {
            if (textContainerRef.current) {
                const effectiveHeight = textContainerRef.current.offsetHeight;
                console.log("effectiveHeight = ", effectiveHeight);
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
                <div className="post-h__time text-sm text-gray-500">{moment(post.createdAt, 'YYYYMMDDHHmmss').format('YYYY년 MM월 DD일 HH:mm:SS')}</div>
                <div className="flex w-full" style={{maxHeight:`${maxHeight}`}}>
                    <StDiv
                        ref={textContainerRef}
                        className="contentArea border-gray-500"
                        style={{width: '60%'}}
                    >
                        <div className="inner-wrapper">
                            {post.content}
                        </div>
                    </StDiv>
                    {
                        post.main_photo_url &&
                        <div
                            className="imageContainer"
                            style={{width: '40%'}}
                        >
                            <Image
                                src={post.main_photo_url}
                                alt="Image"
                                style={{objectFit: 'contain', maxHeight:`${maxHeight}`, width:'100%', height:'auto'}}
                                width={100}
                                height={6000}
                                className="image"
                            />
                        </div>
                    }
                </div>
            </Card>
        </div>
    );
}
