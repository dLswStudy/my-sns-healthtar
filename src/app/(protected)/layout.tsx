import AuthGuard from "@/app/(protected)/_components/AuthGuard";
import MobileNavigator from "@/app/(protected)/_components/MobileNavigator";

export default function Layout({children, modal}: { children: React.ReactNode, modal:React.ReactNode }) {
    return (
        <div id={'protected'} className={'w-full'}>
            <AuthGuard>
                {children}
                {modal}
            </AuthGuard>
            <MobileNavigator/>
        </div>
    );
}