"use client";

import {signOut} from "@/lib/auth";
import {useRouter} from "next/navigation";
import {
    Menubar,
    MenubarContent,
    MenubarItem, MenubarMenu,
    MenubarSeparator, MenubarTrigger
} from "@/components/ui/menubar";
import {CirclePlus, Menu} from "lucide-react";
import useUserStore from "@/stores/client/userStore";
import React from "react";
import {cn} from "@/lib/utils";
type Props = {
    params: { nickname: string },
    className:string
}
export default function UserHeader({params, className}: Props) {
    const {nickname} = params;
    const decodedNickname = decodeURIComponent(nickname);
    const {firestoreUser, clearAuthUser, setFirestoreUser} = useUserStore();
    const router = useRouter();

    const handleProfile = () => {
        router.push(`/users/${firestoreUser.nickname}`)
    }
    const handleLogout = async () => {
        await signOut();
        clearAuthUser();
        setFirestoreUser(null);
    };

    return (
        <div id={'user-header'} className={cn('fixed left-0 top-0 right-0 flex justify-between items-center p-4 bg-white shadow-md', className)}>
            <div>
                <h1 className="text-xl font-bold">{decodedNickname}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <button aria-label="PostAdd">
                    <CirclePlus className="w-6 h-6"/>
                </button>
                <Menubar className='border-none'>
                    <MenubarMenu>
                        <MenubarTrigger>
                            <Menu/>
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem inset>
                                <button className={'w-full'}>
                                    A 설정
                                </button>
                            </MenubarItem>
                            <MenubarItem inset>
                                <button className={'w-full'}>
                                    B 설정
                                </button>
                            </MenubarItem>
                            <MenubarSeparator/>
                            <MenubarItem inset onClick={handleLogout}>
                                <button className={'w-full'}>로그아웃</button>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
        </div>
    );
}