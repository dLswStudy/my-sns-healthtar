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
import {validatePassword} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@firebase/storage";
import {bucketName} from "@/firebase/firebase.config";

const MAX_FILE_SIZE = 2000000; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const formSchema = z.object({
    email: z.string().email("올바른 형식의 이메일을 입력해주세요."),
    profileImage: z.any()
        .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), "jpg/jpeg, png 파일만 업로드 가능합니다.")
        .refine(file => file.size <= MAX_FILE_SIZE, "파일 크기는 최대 2MB입니다."),
    nickName: z.string().regex(/^(?!.*[._-]{2})[가-힣a-zA-Z]{1}[가-힣a-zA-Z0-9._-]{0,28}[가-힣a-zA-Z0-9]{1}$/),
    name: z.string().regex(/^[가-힣a-zA-Z]{2,50}$/),
    password: z.string().refine(validatePassword, {
        message: "비밀번호 생성 가이드라인에 따라 다시 작성해주세요."
    }),
    gender: z.string(),
    birth: z.string().date(),
})
type signupSchema = z.infer<typeof formSchema>
export type signupSchemaV2 = signupSchema & {
    profileImageUrl: string
}
const years = Array.from({length: 100}, (_, i) => '' + (new Date().getFullYear() - i));
const months = Array.from({length: 12}, (_, i) => i + 1 < 10 ? '0' + (i + 1) : '' + (i + 1));
const days = Array.from({length: 31}, (_, i) => i + 1 < 10 ? '0' + (i + 1) : '' + (i + 1));

export default function SignupForm() {
    const {errorMsg, setErrorMsg} = userStore()
    const router = useRouter();
    const handleFocus = (event: any) => {
        setErrorMsg('', 'signUp')
    }
    const form = useForm<signupSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            profileImage: undefined,
            nickName: "",
            name: "",
            password: "",
            gender: "",
            birth: `yyyy-mm-dd`
        }
    })

    const uploadImage = async (file: File, nickname: string): Promise<string> => {
        const storage = getStorage();
        const storageRef = ref(storage, `${bucketName}/profile-images/${nickname}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    }

    async function onSubmit(data: signupSchema) {
        console.log("data = ", data);
        const profileImageUrl = await uploadImage(data.profileImage as File, data.nickName);
        const userData: signupSchemaV2 = {...data, profileImageUrl}
        console.log("profileImageUrl = ", profileImageUrl);

        await fetch('/api/sign?_=up', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userData)
        }).then(() => {
            router.push('/login');
        }).catch((error) => {
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
                    name="profileImage"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
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
                                    onFocus={handleFocus}
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
                    render={({field}) => (
                        <FormItem>
                            <div className={'flex items-center space-x-2'}>

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
                                                <SelectValue placeholder="년도"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {years.map((year) =>
                                                    <SelectItem key={year} value={'' + year}>{year}</SelectItem>
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
                                                <SelectValue placeholder="월"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {months.map((month) => (
                                                    <SelectItem key={month} value={'' + month}>{month}</SelectItem>
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
                    errorMsg._signUp && <FormMessage>{errorMsg._signUp}</FormMessage>
                }
                <div className="signUp__form__buttonArea2 flex justify-start">
                    <Link href={'/login'} className={'other-page-button'}>로그인</Link>
                </div>
            </form>
        </Form>
    )
}