"use client"
import {usePathname, useRouter} from "next/navigation";
import {ReactNode, useEffect, useState} from "react";
import {PUBLIC} from "@/lib/routes";
import {useUser} from "@/lib/auth";
import {Spinner} from "@/components/ui/spinner";

export default function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const {authUser, loading} = useUser()

    useEffect(() => {
        if (!authUser) {
            router.push(`${PUBLIC.ENTRANCE}?continueTo=${pathname}`);
        }
    }, [loading, authUser]);

    if (loading) {
        return <Spinner loading={loading} />; // 로딩 상태를 표시하는 컴포넌트
    }

    if (!loading && authUser) {
        return <>{children}</>;
    }

    return null; // authUser가 없고 로딩이 완료되었을 때 (리다이렉트 중)
}
