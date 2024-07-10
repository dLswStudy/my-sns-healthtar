"use client"

import useUserStore from "@/stores/client/userStore";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "@/firebase/firebase.client.config";
import {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import {PUBLIC} from "@/lib/routes";

export function Auth() {
    const {setAuthUser} = useUserStore()
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setAuthUser(user)
            if(!user) router.push(`${PUBLIC.ENTRANCE}?continueTo=${pathname}`);
        })
    }, []);

    return null;
}