"use client"

import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormMessage, FormDescription, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Link from "next/link";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import userStore from "@/stores/client/userStore";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {api_user} from "@/api/api_user";
import {redirect} from "next/navigation";

const formSchema = z.object({
    email: z.string().email("올바른 형식의 이메일을 입력해주세요."),
    nickName: z.string().regex(/^(?!.*[._-]{2})[가-힣a-zA-Z]{1}[가-힣a-zA-Z._-]{0,28}[가-힣a-zA-Z]{1}$/),
    name: z.string().regex(/^[가-힣a-zA-Z]{2,50}$/),
    password: z.string(),
    gender: z.string(),
    birth: z.string().date()
})
export type signupSchema = z.infer<typeof formSchema>
const years = Array.from({ length: 100 }, (_, i) => ''+(new Date().getFullYear() - i));
const months = Array.from({ length: 12 }, (_, i) => i + 1<10?'0'+(i+1):''+(i+1));
const days = Array.from({ length: 31 }, (_, i) => i + 1<10?'0'+(i+1):''+(i+1));
export default function SignupForm() {
    const {errorMsg, setErrorMsg} = userStore()
    const {handleSubmit, control} = useForm();
    const handleFocus = (event: any) => {
        setErrorMsg('', 'signUp')
    }
    const form = useForm<signupSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            nickName: "",
            name: "",
            password: "",
            gender:"",
            birth: `yyyy-mm-dd`
        }
    })

    function onSubmit(data: signupSchema) {
        console.log("data = ", data);
        api_user.signUp(data)
            .then(() => {
                redirect('/login')
            })
            .catch((error) => {
                console.log(error)
                let erMsg = ''
                if (error.code == 'auth/invalid-credential')
                    erMsg = '이메일 주소와 비밀번호를 다시 확인해주세요.'
                else if (error.code == 'auth/email-already-in-use')
                    erMsg = '이미 로그인 되어 있습니다.'

                setErrorMsg(erMsg, 'signUp')
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
                            <FormDescription>ⓘ 한글 또는 영문 2~30자, 중간에 특수문자 3개(.-_) 연속되지 않게 사용가능</FormDescription>
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
                            <FormDescription>ⓘ 한글 또는 영문 2~50자</FormDescription>
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
                            <FormDescription>ⓘ 영어 대문자, 소문자, 숫자, 특수문자 중<br/>
                                2종류 문자 조합으로 최소 10자리 이상 또는<br/>
                                3종류 문자 조합으로 최소 8자리 이상
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                >
                </FormField>
                <FormField
                    name="gender"
                    control={form.control}
                    render={({field}) => (
                        <div className={'flex items-center space-x-10'}>
                        <FormLabel className={'text-slate-600'}>성별:</FormLabel>
                        <FormItem>
                            <FormControl>
                                <ToggleGroup
                                    type="single"
                                    variant="outline"
                                    value={field.value}
                                    onValueChange={(value) => field.onChange(value)}>
                                    <ToggleGroupItem value="male">남</ToggleGroupItem>
                                    <ToggleGroupItem value="female">여</ToggleGroupItem>
                                </ToggleGroup>
                            </FormControl>
                        </FormItem>
                        </div>)}
                >
                </FormField>
                <FormField
                    control={form.control}
                    name="birth"
                    render={({ field }) => (
                        <FormItem className={'flex items-center space-x-2'}>
                            <FormLabel className={'text-slate-600'}>생년월일:</FormLabel>
                            <FormControl>
                                <div className="flex space-x-3">
                                    <Select
                                        onOpenChange={handleFocus}
                                        onValueChange={(val) => {
                                            console.log("field = ", field);
                                            const ymd = field.value.split('-')
                                            ymd[0] = val
                                            console.log("ymd = ", ymd);
                                            console.log("ymd.join('') = ", ymd.join(''));
                                            field.onChange(ymd.join('-'));
                                            console.log("c field = ", field);
                                        }}
                                    >
                                        <SelectTrigger className="w-[80px] tw-select">
                                            <SelectValue placeholder="년도" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        {years.map((year) =>
                                            <SelectItem key={year} value={''+year}>{year}</SelectItem>
                                        )}
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        onOpenChange={handleFocus}
                                        onValueChange={(val) => {
                                            const ymd = field.value.split('-')
                                            ymd[1] = val
                                            field.onChange(ymd.join('-'));
                                        }}
                                    >
                                        <SelectTrigger className="w-[70px] tw-select">
                                            <SelectValue placeholder="월" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map((month) => (
                                                <SelectItem key={month} value={''+month}>{month}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        onOpenChange={handleFocus}
                                        onValueChange={(val) => {
                                            const ymd = field.value.split('-')
                                            ymd[2] = val
                                            field.onChange(ymd.join('-'));
                                        }}
                                    >
                                        <SelectTrigger className="w-[70px] tw-select">
                                            <SelectValue placeholder="일" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {days.map((day) => (
                                                <SelectItem key={day} value={''+day}>{day}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="signUp__form__buttonArea1 flex justify-center">
                    <Button type="submit">가입</Button>
                </div>
                {
                    errorMsg._signUp && <FormMessage>{errorMsg._signUp}</FormMessage>
                }
                <div className="signUp__form__buttonArea2 flex justify-start">
                    <Link href={'/login'} className={'other-page-button'}>로그인</Link>
                </div>
            </form>
        </Form>
    )
}