"use client"

import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {api_user} from "@/api/api_user";
import {redirect} from "next/navigation";
import {loginSchema} from "@/app/login/loginForm";
import userStore from "@/stores/client/userStore";

const formSchema = z.object({
    email: z.string().email("올바른 형식의 이메일을 입력해주세요."),
    nickName: z.string(),
    name: z.string(),
    password: z.string()
})
export type signupSchema = z.infer<typeof formSchema>
export default function SignupForm() {
    const {errorMsg, setErrorMsg} = userStore()
    const handleFocus = (event: any) => {
        setErrorMsg('','signUp')
    }
    const form = useForm<signupSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            nickName: "",
            name: "",
            password: "",
        }
    })

    function onSubmit(data: signupSchema) {
        console.log("data = ", data);
        api_user.signUp(data)
            .then(()=>{
                redirect('/login')
            })
            .catch((error)=>{
                let erMsg = ''
                if (error.code == 'auth/invalid-credential')
                    erMsg = '이메일 주소와 비밀번호를 다시 확인해주세요.'
                else if (error.code == 'auth/email-already-in-use')
                    erMsg = '이미 로그인 되어 있습니다.'

                setErrorMsg(erMsg,'signUp')
            })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="signUp__form space-y-8 w-96">
                <div className="sign__form__title">
                    <div className="brandNm">헬스타<span>★</span>&nbsp;&nbsp;&nbsp;등록</div>
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="이메일"
                                    className="tw-input tw-w-full"
                                    onFocus={handleFocus}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                >
                </FormField>
                <FormField
                    control={form.control}
                    name="nickName"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="닉네임"
                                    className="tw-input tw-w-full"
                                    onFocus={handleFocus}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                >
                </FormField>
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="이름"
                                    className="tw-input tw-w-full"
                                    onFocus={handleFocus}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                >
                </FormField>
                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="비밀번호"
                                    className="tw-input tw-w-full"
                                    type="password"
                                    onFocus={handleFocus}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                >
                </FormField>
                <div className="signUp__form__buttonArea1 flex justify-center">
                    <Button type="submit">가입</Button>
                </div>
                {errorMsg._signUp && <FormMessage>{errorMsg._signUp}</FormMessage>}
                <div className="signUp__form__buttonArea2 flex justify-start">
                    <Link href={'/login'} className={'other-page-button'}>로그인</Link>
                </div>
            </form>
        </Form>
    )
}