"use client"
import userStore from "@/stores/client/userStore";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Profile() {
    const {firestoreUser} = userStore()
    const router = useRouter()

    useEffect(() => {
        router.replace(`/users/${firestoreUser.nickname}`)
    }, []);

    return null
}
