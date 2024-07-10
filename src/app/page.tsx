"use client"
import {useUser} from "@/lib/auth";
import {PROTECTED, PUBLIC} from "@/lib/routes";
import {useRouter} from "next/navigation";

export default function Home() {
    const {authUser} = useUser()
    const router = useRouter();

    if(!authUser) router.push(PUBLIC.ENTRANCE)
    else router.push(PROTECTED.MAIN);
  return null;
}
