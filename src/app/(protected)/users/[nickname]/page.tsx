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
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {userProfilePageSchema} from "@/lib/schemas";
import SpinByW from "@/components/ui/spinnerW";
import {RotatingLines as Spin} from "react-loader-spinner";
import {Spinner} from "@/components/ui/spinner";


type Props = {
    params: { nickname: string },
}
export default function Profile({params}: Props) {
    const {nickname} = params;
    const decodedNickname: string = decodeURIComponent(nickname);
    const {firestoreUser} = userStore()
    const {setField, userProfilePage} = userProfileStore();
    const [isEditing, setIsEditing] = useState(false);

    const newNicknameRef = useRef<HTMLInputElement>(null);
    const newNameRef = useRef<HTMLInputElement>(null);
    const newHelloWordRef = useRef<HTMLTextAreaElement>(null);
    const isMine = decodedNickname === firestoreUser?.nickname
    const isXs = useMediaQuery({query: '(max-width: 480px)'});
    const router = useRouter()
    const queryClient = useQueryClient();

    const {data: userProfilePageRQ, status, error, isFetching} = useQuery({
        queryKey: ['userProfile'],
        queryFn: async (): Promise<userProfilePageSchema> => getUserByNickname(decodedNickname)
    });

    // const mutation = useMutation(updateUserProfile, {
    //     onSuccess: () => {
    //         queryClient.invalidateQueries(['userProfile', decodedNickname]);
    //     },
    // });

    useEffect(() => {
        if (userProfilePageRQ) {
            console.log("userProfilePageRQ = ", userProfilePageRQ);
            setField('userProfilePage', userProfilePageRQ);
        }

        return () => {
            console.log("userProfilePage Unmount")
            setField('userProfilePage', null);
        };
    }, [userProfilePageRQ]);

    if (!userProfilePage) {
        // return <div>...Loading User Profile</div>;
        // return <Spinner loading={status=='pending'} errMsg={error?.['failureReason']}/>;
        return <Spinner loading={status==='pending'} />;
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

        setIsEditing(false)
    }

    return (
        <div id={'user'}>
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
                            {isMine && isEditing && <Button className={'max-xs:text-xs'} size={isXs ? 'sm' : 'default'}
                                                            onClick={onEditSave}>편집 완료</Button>}
                        </div>
                        <div className="max-xs:space-y-3
                                            xs:flex xs:space-x-3">
                            <div className="profile-image max-xs:flex max-xs:justify-center">
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
                                                <Input ref={newNicknameRef} defaultValue={userProfilePage?.nickname}/>
                                            </div>
                                            <div>
                                                이름:
                                                <Input ref={newNameRef} defaultValue={userProfilePage?.name}/>
                                            </div>
                                            <div>
                                                인사말:
                                                <Textarea ref={newHelloWordRef} defaultValue={userProfilePage?.helloword}/>
                                            </div>
                                        </div>)
                                    : (
                                        <div className="">
                                            <div
                                                className="name font-bold text-xl xs:text-2xl">{userProfilePage?.name}</div>
                                            <p className={'mt-2 max-xs:text-sm'}>{userProfilePage?.helloword}</p>
                                        </div>
                                    )

                                }
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
                <div id={'profile-posts'} className="post-container">

                </div>
            </div>
            <div className="m-menubarH"></div>
        </div>
    )
}