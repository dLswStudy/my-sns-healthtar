"use client"
import {useUser} from "@/lib/auth";
import {PROTECTED, PUBLIC} from "@/lib/routes";
import {useRouter} from "next/navigation";

export default function Home() {
    const {authUser} = useUser()
    const router = useRouter();
    console.log("authUser = ", authUser);

    if(!authUser) router.replace(PUBLIC.ENTRANCE)
    else router.replace(PROTECTED.MAIN);
  return null;
}
