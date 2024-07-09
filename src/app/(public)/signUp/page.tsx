import SignupForm from "@/app/(public)/signUp/_component/signupForm";
export default function SignUp() {
    return (
        <div id={'signUp'} className="signUp flex w-auto h-max mt-16">
            <div className="flex items-center px-4
                            justify-center w-full">
                <SignupForm />
            </div>
        </div>
    )
}