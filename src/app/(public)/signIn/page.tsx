import {Button} from "@/components/ui/button";
import Link from "next/link";
import useUserProfileStore from "@/stores/client/userProfileStore";

export default function SignIn() {
    let emailFL:string|null=''
    if (typeof window !== "undefined") {
        emailFL = localStorage.getItem('emailForSignIn')
    }
    return (
        <div className="login-start space-y-8 w-96">
            <div className="sign__form__title">
                <div className="brandNm">헬스타<span>★</span></div>
            </div>
            <div className="sign__form__buttonArea1 flex justify-center">
                <Button className={"w-full"}>
                    <Link href={"/signIn/form"}>이메일로 시작하기</Link></Button>;
            </div>
        </div>
    );
}
