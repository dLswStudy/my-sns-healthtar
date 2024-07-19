import DotsMenuBtn from "@/app/(protected)/@modal/(.)post/detail/[postId]/_components/dotsMenuBtn";
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
const maxHeight = `${1.5 * (line + 1)}em`
let StDiv = styled.div`
    -webkit-line-clamp: ${line};
`;

export default function PostHorizontal({post, visibleUserInfo = false}: PostVerticalProps) {
    const textContainerRef = useRef(null);
    const router = useRouter()

    return (
        <div className={'post-h relative'}>
            <DotsMenuBtn user_seq={post['user_seq']} postId={post.id}
                         imgUrl={post.main_photo_url}/>
            <Card className={'pCard'}>
                {visibleUserInfo ?
                    <div className="w-full flex items-center justify-between">
                        <div className="userInfo w-full flex items-center">
                            <Avatar>
                                <AvatarImage src={post.profile_image_url} alt={'Avatar'} width={35} height={35}
                                             className={'border-2'}/>
                                <AvatarFallback>USER</AvatarFallback>
                            </Avatar>
                            <div className="ml-2">{post.nickname}</div>
                        </div>
                    </div>
                    : <div className="w-full h-3"></div>
                }
                <div className="post-h__time p-3 pt-0 text-sm text-gray-500">{moment(post.createdAt, 'YYYYMMDDHHmmss').format('YYYY년 MM월 DD일 HH:mm:SS')}</div>
                <div className="flex w-full" style={{maxHeight: `${maxHeight}`}}
                        onClick={()=>{router.push(`/post/detail/${post.id}`)}}>
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
                                style={{objectFit: 'contain', maxHeight: `${maxHeight}`, width: '100%', height: 'auto'}}
                                width={400}
                                height={400}
                                className="image"
                            />
                        </div>
                    }
                </div>
                <div className="post-h__footer">
                    <div className="post-h__heart"></div>
                    <div className="post-h__comment"></div>
                    <div className="post-h__progression">

                    </div>
                </div>
            </Card>
        </div>
    );
}
