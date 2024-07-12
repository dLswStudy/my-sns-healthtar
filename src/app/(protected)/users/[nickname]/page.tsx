"use client"
import {useEffect, useState} from "react";
import userStore from "@/stores/client/userStore";
import {Card} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {getUserByNickname} from "@/lib/auth";

type Props = {
    params: { nickname: string },
}
export default function Profile({params}: Props) {
    const {nickname} = params;
    const decodedNickname = decodeURIComponent(nickname);
    const [pageData, setPageData] = useState(null);
    const {firestoreUser} = userStore()
    const isMine = decodedNickname === firestoreUser?.nickname
    useEffect(() => {
        async function fetchData() {
            if (isMine) {
                setPageData(firestoreUser);
            } else {
                const userData = await getUserByNickname(decodedNickname);
                setPageData(userData);
            }
        }

        fetchData();
    }, [decodedNickname, isMine, firestoreUser]);


    const handleEdit = () => {

    }
    if (pageData === null) {
        return <div>Loading...</div>;
    }

    return (
        <div id={'user'}>
            <div className="relative h-80 mt-8">
                <Card className="absolute left-1/2 -translate-x-1/2
                                            top-[20px] h-auto overflow-visible">
                    <div className="container">
                        <div className="flex justify-end">
                            {isMine && <Button className={'align-bottom'}>Edit Profile</Button>}
                        </div>
                        <div className="max-sm:space-y-3
                                            sm:flex sm:space-x-3">
                            <div className="profile-image max-sm:flex max-sm:justify-center">
                                <Avatar className={'w-52 h-52'}>
                                    <AvatarImage src={pageData?.profile_image_url}/>
                                    <AvatarFallback>USER</AvatarFallback>
                                </Avatar></div>
                            <div className="profile-info">
                                <div className={'max-sm:flex-col-reverse flex text-2xl font-bold justify-between'}>
                                    <div className="nickname leading-loose">{pageData?.nickname}</div>

                                </div>
                                <p className={'mt-2'}>{pageData?.helloword}</p>
                                <div className="flex justify-evenly mt-14">
                                    <div className=""><span className={'font-bold'}>팔로워:</span>
                                        <span>{pageData?.followers.length}</span></div>
                                    <div className=""><span className={'font-bold'}>팔로잉:</span>
                                        <span>{pageData?.followings.length}</span></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Card>
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-36 bg-slate-700 -z-10"></div>
            </div>

        </div>
    )
}