import SignupForm from "@/app/signUp/signupForm";
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