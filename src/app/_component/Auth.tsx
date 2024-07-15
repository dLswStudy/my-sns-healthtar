"use client"

import useUserStore from "@/stores/client/userStore";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "@/firebase/firebase.client.config";
import {ReactNode, useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {PUBLIC} from "@/lib/routes";
import {useUser} from "@/lib/auth";
import {Spinner} from "@/components/ui/spinner";

export function Auth({ children }: { children: ReactNode }) {
    const {loading} = useUser('APP')

    return (
        <>
            {loading ? <Spinner loading={loading} /> : children}
        </>
    );
}