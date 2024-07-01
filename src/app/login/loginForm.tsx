"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {api_user} from "@/api/api_user";
import {redirect} from "next/navigation";
import userStore from "@/stores/client/userStore";

const formSchema = z.object({
    email: z.string().email("올바른 형식의 이메일을 입력해주세요."),
    password: z.string()
})
export type loginSchema = z.infer<typeof formSchema>

export default function LoginForm() {
    const {errorMsg, setErrorMsg} = userStore()
    const handleFocus = (event: any) => {
        setErrorMsg('','signIn')
    }
    // @ts-ignore
    const form = useForm<loginSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })
    function onSubmit(data: loginSchema) {
        console.log("data = ", data);
        api_user.signIn(data)
            .then(()=>{
                redirect('/')
            })
            .catch((error)=>{
                let erMsg = ''
                if (error.code == 'auth/invalid-credential')
                    erMsg = '이메일 주소와 비밀번호를 다시 확인해주세요.'
                else if (error.code == 'auth/email-already-in-use')
                    erMsg = '이미 로그인 되어 있습니다.'

                setErrorMsg(erMsg,'signIn')
            })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="sign__form space-y-8 w-96">
                <div className="sign__form__title">
                    <div className="brandNm">헬스타<span>★</span></div>
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
                <div className="sign__form__buttonArea1 flex justify-center">
                    <Button type="submit">로그인</Button>
                </div>
                {errorMsg._signIn && <FormMessage>{errorMsg._signIn}</FormMessage>}
                <div className="sign__form__buttonArea2 flex justify-end">
                    <Link href={'/signUp'} className={'other-page-button'}>가입하기</Link>
                </div>
            </form>
        </Form>
    )
}