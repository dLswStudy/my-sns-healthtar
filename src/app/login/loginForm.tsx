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

const formSchema = z.object({
    email: z.string().email("올바른 형식의 이메일을 입력해주세요."),
    password: z.string()
})
export type loginSchema = z.infer<typeof formSchema>

export default function LoginForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })
    function onSubmit(data: loginSchema) {
        console.log("data = ", data);

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="login__form space-y-8 w-96">
                <div className="login__form__title">
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
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                >
                </FormField>
                <div className="login__form__buttonArea1 flex justify-center">
                    <Button type="submit">로그인</Button>
                </div>
                <div className="login__form__buttonArea2 flex justify-end">
                    <Link href={'/'} className={'sign-up-button'}>회원가입</Link>
                </div>
            </form>
        </Form>
    )
}