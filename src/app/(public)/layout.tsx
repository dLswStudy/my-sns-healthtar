import {ReactNode} from "react";
import AuthRaise from "@/app/(public)/_component/AuthRaise";
import SignupForm from "@/app/(public)/signUp/_component/signupForm";

export default function Layout({children}: { children: ReactNode }) {
    return (
        <AuthRaise>
            <div id={'signUp'} className="signUp flex w-auto h-max mt-16">
                <div className="flex items-center px-4
                            justify-center w-full">
                    {children}
                </div>
            </div>
        </AuthRaise>
    );
}