"use client"
import {useUser} from "@/lib/auth";
import {PROTECTED, PUBLIC} from "@/lib/routes";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Home() {
    const {authUser} = useUser('Home')
    const router = useRouter();
    console.log("authUser = ", authUser);

    useEffect(() => {
        if(!authUser) router.replace(PUBLIC.ENTRANCE)
        else router.replace(PROTECTED.MAIN);
    }, []);
  return null;
}
