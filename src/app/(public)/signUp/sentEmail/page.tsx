"use client"
import userStore from "@/stores/client/userStore";
import {isSignInWithEmailLink} from "firebase/auth";
import {auth} from "@/firebase/firebase.client.config";
import {useEffect, useState} from "react";
import {signUp} from "@/lib/auth";
import {errorHandle} from "@/lib/utils";

export default function SentEmail() {
    const {emailBeforeAuth, signUpUser, setFirestoreUser} = userStore()
    const [errMsg, setErrMsg] = useState('');
    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            signUp(signUpUser, setFirestoreUser)
                .then(async res => {
                    const errhandle = await errorHandle(res)
                    if (errhandle.isError) {
                        setErrMsg(errhandle.message)
                        return
                    }

                    console.log('sign up success')
                }).catch(err => {
                setErrMsg('에러가 발생하였습니다. 잠시 후 다시 시도해주세요.')
            })
            if(errMsg) alert(errMsg)
        }
    }, [])


    return (
        <div>
            <div className="sign__form__title">
                <div className="brandNm">헬스타<span>★</span>&nbsp;&nbsp;&nbsp;등록</div>
            </div>
            <div className="sent__email mt-14">
                <h3><span className={'font-bold'}>{emailBeforeAuth}</span> 로 인증 이메일이 전송되었습니다.<br/>인증 링크를 클릭하시면 바로 로그인
                    처리됩니다.</h3>
            </div>
        </div>

    );
}
