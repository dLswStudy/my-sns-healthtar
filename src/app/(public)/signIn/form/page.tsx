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
import {useRouter, useSearchParams} from "next/navigation";
import userStore from "@/stores/client/userStore";
import {errorHandle} from "@/lib/utils";
import {Checkbox} from "@/components/ui/checkbox";
import {PROTECTED} from "@/lib/routes";
import {signIn} from "@/lib/auth";
import useUserProfileStore from "@/stores/client/userProfileStore";
import ButtonsStorage from "@/components/ButtonsStorage";
import {useEffect} from "react";

const formSchema = z.object({
    email: z.string().email("올바른 형식의 이메일을 입력해주세요."),
    password: z.string().min(1,'비밀번호를 입력해주세요').min(8,'비밀번호를 끝까지 입력해주세요.'),
    rememberMe: z.boolean()
})
export type loginSchema = z.infer<typeof formSchema>
export type loginSchemaV2 = loginSchema & {
    action: string
}

export default function SignInForm() {
    const {apiErrorMsg,setSignUpUser, setApiErrorMsg, setFirestoreUser} = userStore()
    const router = useRouter();
    const searchParams = useSearchParams();
    const continueTo = searchParams.get("continueTo") ?? PROTECTED.MAIN;
    const {userProfilePage} = useUserProfileStore()

    useEffect(()=>{
        setSignUpUser(null)
        setApiErrorMsg('','signIn')
        setApiErrorMsg('','signUp')
    },[])
    const handleClick = (event: any) => {
        setApiErrorMsg('', 'signIn')
    }
    // @ts-ignore
    const form = useForm<loginSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe:false
        }
    })

    async function onSubmit(data: loginSchema) {
        await signIn(data.email, data.password, data.rememberMe, setFirestoreUser)
            .then(async res => {
                const errorhandle = await errorHandle(res)
                if (errorhandle.isError) {
                    setApiErrorMsg(errorhandle.message, 'signIn')
                    return
                }
                router.replace(continueTo);
            })
            .catch((error) => {
                setApiErrorMsg(error.message, 'signIn')
            })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="sign__form space-y-8 max-xs:w-72 w-96">
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
                                    onClick={handleClick}
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
                                    onClick={handleClick}
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
                    name={'rememberMe'}
                    render={
                        ({field}) => (
                            <FormItem>
                                <FormControl>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            id="rememberMe"
                                            name="rememberMe"
                                            type={'checkbox'}
                                            checked={field.value}
                                            onChange={(val) =>field.onChange(val)}/>
                                        <label
                                            htmlFor="rememberMe"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            브라우저에 로그인 기억하기
                                        </label>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )
                    }/>
                <div className="sign__form__buttonArea1 flex justify-center">
                    <Button type="submit">로그인</Button>
                </div>
                {apiErrorMsg._signIn && <FormMessage>{apiErrorMsg._signIn}</FormMessage>}
                <div className="sign__form__buttonArea2 flex justify-between">
                    <Link href={'/signIn'} className={'other-page-button'}>뒤로가기</Link>
                    <Link href={'/signUp'} className={'other-page-button'}>가입 및 로그인</Link>
                </div>
                {/*<ButtonsStorage/>*/}
            </form>
        </Form>
    )
}