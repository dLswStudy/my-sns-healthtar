"use client";

import { useRouter } from "next/navigation";
import userStore from "@/stores/client/userStore";
import { signOut } from "@/lib/auth";

export default function UserMenu() {
    const { setAuthUser } = userStore();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        setAuthUser(null);
        router.push("/signIn");
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
            <div className="fixed top-0 left-0 w-3/4 h-full bg-white p-4">
                <button onClick={() => router.push("/profile")}>프로필</button>
                <button onClick={handleLogout}>로그아웃</button>
            </div>
        </div>
    );
}
