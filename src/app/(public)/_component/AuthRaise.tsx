"use client"
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {ReactNode, useEffect, useState} from "react";
import {PROTECTED, PUBLIC} from "@/lib/routes";
import useUserStore from "@/stores/client/userStore";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "@/firebase/firebase.client.config";
import {useUser} from "@/lib/auth";
import userStore from "@/stores/client/userStore";
import {Spinner} from "@/components/ui/spinner";

export default function AuthRaise({ children }: { children: ReactNode }) {
    const router = useRouter();

    const {authUser, loading} = useUser()

    useEffect(() => {
        if (authUser) {
            router.push(PROTECTED.MAIN);
        }
    }, [authUser]);

    if (loading) {
        return <Spinner loading={loading} />; // 로딩 상태를 표시하는 컴포넌트
    }

    if (!authUser) {
        return <>{children}</>;
    }

    return null; // authUser가 없고 로딩이 완료되었을 때 (리다이렉트 중)

}
