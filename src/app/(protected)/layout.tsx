import {ReactNode} from "react";
import AuthGuard from "@/app/(protected)/_components/AuthGuard";
import Header from "@/app/(protected)/_components/Header";
import MobileNavigator from "@/app/(protected)/_components/MobileNavigator";

export default function Layout({children}: { children: ReactNode }) {
    return (
        <div id={'protected'} className={'w-full h-full'}>
            <AuthGuard>
                {children}
            </AuthGuard>
            <MobileNavigator/>
        </div>
    );
}