"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {signOut} from "@/lib/auth";
import {useRouter} from "next/navigation";
import {
    Menubar,
    MenubarContent,
    MenubarItem, MenubarMenu,
    MenubarSeparator, MenubarTrigger
} from "@/components/ui/menubar";
import Link from "next/link";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import useUserStore from "@/stores/client/userStore";

export default function Header() {
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
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
            <div>
                <h1 className="text-xl font-bold">Healthtar ★</h1>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative ml-auto flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    />
                </div>
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>
                            <Avatar>
                                <AvatarImage src={firestoreUser?.profile_image_url}/>
                                <AvatarFallback>USER</AvatarFallback>
                            </Avatar>
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem inset onClick={handleProfile}>
                                <button className={'w-full'}>
                                    Profile: {firestoreUser?.nickname}
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
        </header>
    );
}