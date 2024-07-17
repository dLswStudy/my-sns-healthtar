"use client"
import {useEffect, useRef, useState} from "react";
import userStore from "@/stores/client/userStore";
import {getUserByNickname} from "@/lib/auth";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import UserHeader from "@/app/(protected)/users/[nickname]/_components/UserHeader";
import {useMediaQuery} from "react-responsive";
import UserAspectTabContent from "./_components/UserAspectTabcontent";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import {PROTECTED} from "@/lib/routes";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import userProfileStore from "@/stores/client/userProfileStore";
import {useQuery, useMutation, useQueryClient, useInfiniteQuery} from "@tanstack/react-query";
import {userProfilePageSchema} from "@/lib/schemas";
import {Spinner} from "@/components/ui/spinner";
import {setProfile} from "@/app/api/profile/profileService";
import SpinByW from "@/components/ui/spinnerW";
import {handleImagePreview} from "@/lib/utils";
import {getMyPosts} from "@/app/api/post/postService";
import PostVertical from "@/app/(protected)/post/_components/postVertical";
import PostHorizontal from "@/app/(protected)/post/_components/postHorizontal";
import Link from "next/link";


type Props = {
    params: { nickname: string },
}
export default function User({params}: Props) {
    const {nickname} = params;
    const decodedNickname: string = decodeURIComponent(nickname);
    const {firestoreUser,setFirestoreUser} = userStore()
    const {setField, userProfilePage,images,immerSetField, myPosts} = userProfileStore();
    const [isEditing, setIsEditing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isMine = decodedNickname === firestoreUser?.nickname
    const isXs = useMediaQuery({query: '(max-width: 480px)'});
    const router = useRouter()
    const queryClient = useQueryClient();

    const fetchMyPosts = async ({pageParam = null}) => {
        const {posts, lastVisible} = await getMyPosts(firestoreUser.seq, pageParam);
        return {posts, nextPage: lastVisible};
    };

    const {data: userProfilePageRQ, status, error, isFetching} = useQuery({
        queryKey: ['userProfile', decodedNickname],
        queryFn: async (): Promise<userProfilePageSchema> => getUserByNickname(decodedNickname),
        gcTime:0,
        staleTime:0
    });

    const {
        data:myPostsRQ,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status:myPostsStauts,
    } = useInfiniteQuery({
        queryKey: ['myPosts', firestoreUser.seq],
        queryFn: fetchMyPosts,
        getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
        initialPageParam: null,
        gcTime:0,
        staleTime:0
    });

    const {mutate:profilePutMutate, status:putStatus, error:putError} = useMutation({
        mutationFn: (userProfilePage: userProfilePageSchema) => setProfile(userProfilePage, images, setFirestoreUser),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] })
            alert('프로필 업데이트 완료')
            // 닉네임이 변경된 경우 경로 업데이트
            if (userProfilePage.nickname !== decodedNickname) {
                router.replace(`/users/${(userProfilePage.nickname)}`);
            }
            setIsEditing(false)
        },
        onError: (error) => {
            // 에러 처리
            alert(`프로필 업데이트 실패: ${error}`);
        },
    })

    useEffect(() => {
        console.log("%cuserProfilePage Mount","color:green")
        if (userProfilePageRQ) {
            console.log("userProfilePageRQ = ", userProfilePageRQ);
            setField('userProfilePage', userProfilePageRQ);
        }
        if (myPostsRQ) {
            setField('myPosts', myPostsRQ);
        }

        return () => {
            console.log("userProfilePage Unmount")
            setField('userProfilePage', null);
            setField('images', null);
            setField('myPosts', null);
        };
    }, [userProfilePageRQ, myPostsRQ]);

    if (!userProfilePage) {
        return <Spinner loading={status==='pending'} />;
    }

    const setProfileImgFile = (file) => {
        immerSetField(state => {
            state.images['profile_img_file'] = file
        })
    }
    const setProfileImgUrl = (url) => {
        immerSetField(state => {
            //임시 미리보기용
            state.userProfilePage['profile_image_url'] = url
        })
    }
    const onEditExecute = () => {
        console.log("userProfilePage = ", userProfilePage);
        setIsEditing(true)
    }
    const onEditCancel = () => {
        console.log('%conEditCancel', "color:blue")
        router.replace(PROTECTED.MAIN)
    }
    const onEditSave = () => {
        profilePutMutate(userProfilePage)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        immerSetField((state)=>{state['userProfilePage'][`${field}`] = e.target.value});
    };

    return (
        <div id={'user'}>
            <canvas ref={canvasRef} style={{display: 'none'}}></canvas>
            <UserHeader params={params} className={'headerH z-50'}/>
            <div className="headerH"></div>
            <div className="bandBG absolute top-40 w-full h-36 bg-slate-700 -z-10"></div>
            <div className="flex flex-col items-center h-50 mt-4 xs:mt-8">
                <Card id={'profile-main'} className={'w-[300px] xs:w-[470px]'}>
                    <div className="container">
                        <div className="flex justify-end pb-2 space-x-2">
                            {isMine && !isEditing && <Button className={'max-xs:text-xs'} size={isXs ? 'sm' : 'default'}
                                                             onClick={onEditExecute}>프로필 편집</Button>}
                            {isMine && isEditing && <Button className={'max-xs:text-xs'} size={isXs ? 'sm' : 'default'}
                                                            onClick={onEditCancel} variant={'secondary'}>편집 취소</Button>}
                            {isMine && isEditing &&
                                <SpinByW loading={putStatus === 'pending'}>
                                    <Button className={'max-xs:text-xs'} size={isXs ? 'sm' : 'default'}
                                            onClick={onEditSave}>프로필 저장</Button>
                                </SpinByW>
                            }
                        </div>
                        <div className="max-xs:space-y-3 xs:flex xs:space-x-3">
                            <div className="profile-image flex flex-col items-center relative">
                                {isEditing && <div>※ 이미지를 클릭하여 업로드</div>}
                                {isEditing &&
                                    <div
                                        className="absolute inset-0 flex items-center justify-center opacity-60 cursor-pointer z-10">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                handleImagePreview(e,canvasRef, setProfileImgFile, setProfileImgUrl);
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                        />
                                    </div>
                                }
                                <Avatar className={'w-32 h-32 xs:w-40 xs:h-40'}>
                                    <AvatarImage src={userProfilePage?.profile_image_url}/>
                                    <AvatarFallback>USER</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="profile-info">
                                {isEditing ? (
                                    <div className={'space-y-2'}>
                                        <div>
                                            닉네임:
                                            <Input defaultValue={userProfilePage?.nickname}
                                                   onChange={(e) => handleInputChange(e, 'nickname')}/>
                                        </div>
                                        <div>
                                            이름:
                                            <Input defaultValue={userProfilePage?.name}
                                                   onChange={(e) => handleInputChange(e, 'name')}/>
                                        </div>
                                        <div>
                                            인사말:
                                            <Textarea defaultValue={userProfilePage?.helloword}
                                                      onChange={(e) => handleInputChange(e, 'helloword')}/>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="">
                                        <div
                                            className="name font-bold text-xl xs:text-2xl">{userProfilePage?.name}</div>
                                        <p className={'mt-2 max-xs:text-sm'}>{userProfilePage?.helloword}</p>
                                    </div>
                                )}
                                <div className="flex justify-start mt-14 space-x-11 xs:space-x-8">
                                    <div className="max-xs:text-sm"><span className={'font-bold'}>게시물:</span>
                                        <span>{userProfilePage?.posts}</span></div>
                                    <div className="max-xs:text-sm"><span className={'font-bold'}>팔로워:</span>
                                        <span>{userProfilePage?.followers}</span></div>
                                    <div className="max-xs:text-sm"><span className={'font-bold'}>팔로잉:</span>
                                        <span>{userProfilePage?.followings}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card id={'profile-aspect'} className={'w-[300px] xs:w-[470px] mt-3'}>
                    <div className="container">
                        <Tabs defaultValue="present" className="w-full">
                            <TabsList>
                                <TabsTrigger value="present">현재</TabsTrigger>
                                <TabsTrigger value="goal">목표</TabsTrigger>
                            </TabsList>
                            <TabsContent value="present">
                                <UserAspectTabContent aspect={'present'} imgUrl={userProfilePage?.present?.img}
                                                      content={userProfilePage?.present?.content}
                                                      isEditing={isEditing}/>
                            </TabsContent>
                            <TabsContent value="goal">
                                <UserAspectTabContent aspect={'goal'} imgUrl={userProfilePage?.goal?.img}
                                                      content={userProfilePage?.goal?.content} isEditing={isEditing}/>
                            </TabsContent>
                        </Tabs>
                    </div>
                </Card>
                <div id={'profile-posts'} className="post-container mt-5">
                    {
                        myPosts?.['pages']?.map((page, i) => (
                            <div key={i}>
                                {page.posts.map((post, j) => (
                                    <div key={j}>
                                        <Link href={`/post/detail/${post.id}`} passHref>
                                            <PostHorizontal post={post} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="m-menubarH"></div>
        </div>
    )
}