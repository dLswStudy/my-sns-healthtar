import {ReactNode} from "react";
import AuthGuard from "@/app/(protected)/_components/AuthGuard";
import Header from "@/app/(protected)/_components/Header";

export default function Layout({children}: { children: ReactNode }) {
    return (
        <>
            <Header />
            <AuthGuard>
                {children}
            </AuthGuard>
        </>
    );
}