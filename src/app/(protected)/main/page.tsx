"use client"
import Header from "@/app/(protected)/_components/Header";
import useUserStore from "@/stores/client/userStore";
import {useRouter} from "next/navigation";
import {asyncSet, asyncWait} from "@/lib/utils";

export default function Main() {
    console.log('%cMain',"color:green")
    const {firestoreUser} = useUserStore();
    const router = useRouter();
    router.replace(`/users/${firestoreUser.nickname}`)

}