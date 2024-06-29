import {auth, createUserWithEmailAndPassword} from "@/firebase/firebase.config";
import {loginSchema} from "@/app/login/loginForm";
export const user = {
    signUp:(data:loginSchema)=>{
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                // 회원가입 성공시
                console.log(userCredential);
            })
            .catch((error) => {
                // 회원가입 실패시
                console.error(error);
            });
    }
}