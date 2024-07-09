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
import {errorHandle, validatePassword} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@firebase/storage";
import {bucketName} from "@/app.config";
import {useEffect, useState} from "react";
import {storage} from "@/firebase/firebase.client.config";

const MAX_FILE_SIZE = 2000000; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const formSchema = z.object({
    email: z.string().min(1, '이메일을 입력해주세요.').email("올바른 형식의 이메일을 입력해주세요."),
    profileImage: z.any()
        .refine(file => file instanceof File, "프로필 이미지를 선택해주세요.")
        .refine(file => ACCEPTED_IMAGE_TYPES.includes(file?.type), "jpg/jpeg, png 파일만 업로드 가능합니다.")
        .refine(file => file?.size <= MAX_FILE_SIZE, "파일 크기는 최대 2MB입니다."),
    nickName: z.string().regex(/^(?!.*[._-]{2})[가-힣a-zA-Z]{1}[가-힣a-zA-Z0-9._-]{0,28}[가-힣a-zA-Z0-9]{1}$/),
    helloword: z.string().max(50, '최대 50자까지 입력 할 수 있습니다.'),
    name: z.string().regex(/^[가-힣a-zA-Z]{2,50}$/),
    password: z.string().refine(validatePassword, {
        message: "비밀번호 생성 가이드라인에 따라 다시 작성해주세요."
    }),
    gender: z.string().refine(g => g.length > 0, '성별을 선택하세요.'),
    birth: z.string().date(),
    isEmailVerified: z.boolean().refine(bool => bool, "이메일 인증을 완료해주세요.")
})
type signupSchema = z.infer<typeof formSchema>
export type signupSchemaV2 = signupSchema & {
    profileImageUrl: string,
    action: string
}
const years = Array.from({length: 100}, (_, i) => '' + (new Date().getFullYear() - i));
const months = Array.from({length: 12}, (_, i) => i + 1 < 10 ? '0' + (i + 1) : '' + (i + 1));
const days = Array.from({length: 31}, (_, i) => i + 1 < 10 ? '0' + (i + 1) : '' + (i + 1));

export default function SignupForm() {
    const {
        apiErrorMsg,
        setApiErrorMsg,
    } = userStore()
    const [timeLeft, setTimeLeft] = useState(180); // 초기 시간 180초 (3분)
    const [buttonText, setButtonText] = useState("인증하기");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const router = useRouter();

    // 임시로 생성된 계정 있으면 삭제
    const deleteTemporalAccount = async () => fetch('/api/sign/deleteTemporalAccount');
    useEffect(() => {
        console.log('siginup mounted')
        deleteTemporalAccount()
    }, []);

    const handleClick = (e: any) => {
        form.clearErrors(e.target.name)
        if (e.target.name == 'email')
            form.clearErrors('isEmailVerified')
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
            isEmailVerified: false
        }
    })

    const uploadImage = async (file: File, nickname: string): Promise<string> => {
        const storageRef = ref(storage, `${bucketName}/profile-images/${nickname}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    }

    const formatTime = (time: number) => {
        console.log("time = ", time);
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const timeText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        console.log("timeText = ", timeText);
        setButtonText(timeText)
    };


    async function verifyEmail(email: string) {
        const isErrorClear = await form.trigger('email')
        if (!isErrorClear) {
            return
        }
        // 임의 비번으로 등록->로그인->인증메일전송
        await fetch('/api/sign/verifyEmail', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email})
        }).then(async res => {
            const errorhandle = await errorHandle(res)
            if (errorhandle.isError) {
                console.log("errorhandle.code = ", errorhandle.code);
                if (errorhandle.code != 409)
                    await deleteTemporalAccount()
                form.setError('email', {type: 'manual', message: errorhandle.message})
                return
            }

            // 버튼 클릭 시 타이머 시작
            if (buttonText === "인증하기") {
                setButtonDisabled(true);
                setTimeLeft(181);
            }
            let intervalAPI;
            const intervalTime = setInterval(() => {
                setTimeLeft(currTime => {
                    if (currTime <= 1) {  // 이 부분을 수정하여 0이 되었을 때 종료되도록 처리
                        clearInterval(intervalAPI);
                        clearInterval(intervalTime);
                        setButtonText("인증하기");
                        setButtonDisabled(false);
                        console.log('3분 경과, 검증 종료');
                        deleteTemporalAccount()
                        return 0;  // 타이머 종료 시 0으로 리셋
                    }
                    const newTime = currTime - 1;
                    formatTime(newTime);  // 먼저 시간을 감소시킨 후 포맷 함수 호출
                    return newTime;
                });
            }, 1000);

            intervalAPI = setInterval(async () => {
                // 사용자가 임의의 시간에 인증메일 링크 클릭
                // -> 서버가 알 수 없음.
                // -> 주기적 확인: 1초마다 [임시계정 로그인->CurrentUser.emailVerified 확인]
                const response = await fetch('/api/sign/chkEmailVerifiedForSignUp');
                const emailVrfd = (await response.json()).emailVerified
                console.log("auth.currentUser?.emailVerified = ", emailVrfd);
                if (emailVrfd) {
                    clearInterval(intervalAPI);
                    clearInterval(intervalTime);
                    alert('이메일이 인증되었습니다.');
                    setButtonText("인증완료");
                    setButtonDisabled(true);
                    form.setValue('isEmailVerified', true)
                    form.setError('email', {type: 'manual', message: ''})
                } else {
                    console.log('이메일 인증 대기 중...');
                }
            }, 1000);  // 1초마다 실행

        }).catch(error => {
            deleteTemporalAccount()
            form.setError('email', {type: 'manual', message: error.message})
        })

    }

    async function onSubmit(data: signupSchema) {
        console.log("data = ", data);
        const profileImageUrl = await uploadImage(data.profileImage as File, data.nickName);
        const action = 'up'
        const userData: signupSchemaV2 = {...data, profileImageUrl, action}
        let erMsg = ''
        await fetch('/api/sign', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userData)
        }).then(async res => {
            const errhandle = await errorHandle(res)
            if (errhandle.isError) {
                erMsg = errhandle.message
                return
            }

            console.log('sign up success')
            router.push('/signIn/form');
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
                            <div className={"flex"}>
                                <FormControl>
                                    <Input
                                        placeholder="이메일"
                                        className="tw-input tw-w-full"
                                        onClick={handleClick}
                                        {...field}
                                    />
                                </FormControl>
                                <Button type='button' className="ml-1"
                                        onClick={() => verifyEmail(field.value)}
                                        disabled={!Boolean(field.value) || Boolean(form.formState.errors.email) || buttonDisabled}
                                >{buttonText}</Button>
                            </div>
                            <FormMessage>{form.formState.errors.isEmailVerified && form.formState.errors.isEmailVerified.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isEmailVerified"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    type="checkbox"
                                    checked={field.value}
                                    className="hidden"
                                    onChange={e => field.onChange(e.target.checked)}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
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