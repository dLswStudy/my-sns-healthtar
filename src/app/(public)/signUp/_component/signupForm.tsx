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
import {errorHandle, exportNickname, validatePassword} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {getDownloadURL, ref, uploadBytes} from "@firebase/storage";
import {bucketName} from "@/app.config";
import {useEffect, useState} from "react";
import {storage} from "@/firebase/firebase.client.config";
import {authSendSignInLinkToEmail} from "@/lib/auth";

const MAX_FILE_SIZE = 2000000; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const formSchema = z.object({
    email: z.string().min(1, '이메일을 입력해주세요.').email("올바른 형식의 이메일을 입력해주세요."),
    profileImage: z.any()
        .refine(file => file instanceof File, "프로필 이미지를 선택해주세요.")
        .refine(file => ACCEPTED_IMAGE_TYPES.includes(file?.type), "jpg/jpeg, png 파일만 업로드 가능합니다.")
        .refine(file => file?.size <= MAX_FILE_SIZE, "파일 크기는 최대 2MB입니다."),
    nickName: z.string().regex(/^(?!.*[._-]{2})[가-힣a-zA-Z]{1}[가-힣a-zA-Z0-9._-]{0,28}[가-힣a-zA-Z0-9]{1}$/).refine(exportNickname,'yes'),
    helloword: z.string().max(50, '최대 50자까지 입력 할 수 있습니다.'),
    name: z.string().regex(/^[가-힣a-zA-Z]{2,50}$/),
    password: z.string().refine(validatePassword, {
        message: "비밀번호 생성 가이드라인에 따라 다시 작성해주세요."
    }),
    gender: z.string().refine(g => g.length > 0, '성별을 선택하세요.'),
    birth: z.string().date(),
    rememberMe: z.boolean()
})
type signupSchema = z.infer<typeof formSchema>
export type signupSchemaV2 = signupSchema & {
    profileImageUrl: string,
}
const years = Array.from({length: 100}, (_, i) => '' + (new Date().getFullYear() - i));
const months = Array.from({length: 12}, (_, i) => i + 1 < 10 ? '0' + (i + 1) : '' + (i + 1));
const days = Array.from({length: 31}, (_, i) => i + 1 < 10 ? '0' + (i + 1) : '' + (i + 1));

export default function SignupForm() {
    const {
        apiErrorMsg,
        setApiErrorMsg,
        setEmailBeforeAuth,
        setSignUpUser
    } = userStore()
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setApiErrorMsg('','signUp')
    }, []);

    const handleClick = (e: any) => {
        form.clearErrors(e.target.name)
    }
    const form = useForm<signupSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            profileImage: undefined,
            helloword: '',
            nickName: "",
            name: "",
            password: "",
            gender: '',
            birth: `yyyy-mm-dd`,
            rememberMe: false
        }
    })

    const uploadImage = async (file: File, nickname: string): Promise<string> => {
        const storageRef = ref(storage, `${bucketName}/profile-images/${nickname}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    }

    async function onSubmit(data: signupSchema) {
        const profileImageUrl = await uploadImage(data.profileImage as File, data.nickName);
        const userData: signupSchemaV2 = {...data, profileImageUrl}
        let erMsg = ''
        setSignUpUser(userData)
        await authSendSignInLinkToEmail(data.email)
            .then(async res => {
            const errhandle = await errorHandle(res)
            if (errhandle.isError) {
                erMsg = errhandle.message
                return
            }

            setEmailBeforeAuth(data.email)
            console.log('send email success')
            router.push('/signUp/sentEmail');
        }).catch(err => {
            erMsg = '에러가 발생하였습니다. 잠시 후 다시 시도해주세요.'
        })
        setApiErrorMsg(erMsg, 'signUp')
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
                                        onClick={handleClick}
                                        {...field}
                                    />
                                </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
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
                                            로그인 기억하기
                                        </label>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )
                    }/>
                <FormField
                    control={form.control}
                    name="profileImage"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onClick={handleClick}
                                    onChange={(e) => field.onChange(e.target.files?.[0])}
                                    className="tw-input tw-w-full"
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
                                    onClick={handleClick}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>ⓘ 한글 또는 영문 2~30자, 첫글자 제외하고 숫자 사용가능, 중간에 특수문자 3개(.-_) 연속되지 않게
                                사용가능</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                >
                </FormField>
                <FormField
                    control={form.control}
                    name="helloword"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="인사말"
                                    className="tw-input tw-w-full"
                                    onClick={handleClick}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>ⓘ 최대 50자</FormDescription>
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
                                    onClick={handleClick}
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
                                    onClick={handleClick}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>ⓘ * 영어 대문자, 소문자, 숫자, 특수문자 중<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2종류 문자 조합으로 최소 10자리 이상 또는<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3종류 문자 조합으로 최소 8자리 이상<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;* 연속된 숫자나 연속적으로 배치된 키보드 문자, <br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;연속된 닉네임 문자 3개 이상 포함 불가
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
                        <>
                            <div className={'flex items-center space-x-10'}>
                                <FormLabel className={'text-slate-600'}>성별:</FormLabel>
                                <FormItem>
                                    <FormControl>
                                        <ToggleGroup
                                            type="single"
                                            variant="outline"
                                            value={field.value}
                                            onValueChange={(value) => field.onChange(value)}>
                                            <ToggleGroupItem value={'1'}>남</ToggleGroupItem>
                                            <ToggleGroupItem value={'0'}>여</ToggleGroupItem>
                                        </ToggleGroup>
                                    </FormControl>
                                </FormItem>
                                <FormMessage/>
                            </div>
                        </>
                    )}>
                </FormField>
                <FormField
                    control={form.control}
                    name="birth"
                    render={({field}) => (
                        <FormItem>
                            <div className={'flex items-center space-x-2'}>

                                <FormLabel className={'text-slate-600'}>생년월일:</FormLabel>
                                <FormControl>
                                    <div className="flex space-x-3">
                                        <Select
                                            onValueChange={(val) => {
                                                const ymd = field.value.split('-')
                                                ymd[0] = val
                                                field.onChange(ymd.join('-'));
                                            }}
                                        >
                                            <SelectTrigger className="w-[80px] tw-select">
                                                <SelectValue placeholder="년도"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {years.map((year) =>
                                                    <SelectItem key={year} value={'' + year}>{year}</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            onValueChange={(val) => {
                                                const ymd = field.value.split('-')
                                                ymd[1] = val
                                                field.onChange(ymd.join('-'));
                                            }}
                                        >
                                            <SelectTrigger className="w-[70px] tw-select">
                                                <SelectValue placeholder="월"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {months.map((month) => (
                                                    <SelectItem key={month} value={'' + month}>{month}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            onValueChange={(val) => {
                                                const ymd = field.value.split('-')
                                                ymd[2] = val
                                                field.onChange(ymd.join('-'));
                                            }}
                                        >
                                            <SelectTrigger className="w-[70px] tw-select">
                                                <SelectValue placeholder="일"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {days.map((day) => (
                                                    <SelectItem key={day} value={'' + day}>{day}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </FormControl>
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="signUp__form__buttonArea1 flex justify-center">
                    <Button type="submit">가입</Button>
                </div>
                {
                    apiErrorMsg._signUp && <FormMessage>{apiErrorMsg._signUp}</FormMessage>
                }
                <div className="signUp__form__buttonArea2 flex justify-start">
                    <Link href={'/signIn/form'} className={'other-page-button'}>로그인</Link>
                </div>
            </form>
        </Form>
    )
}