import {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "@/firebase/firebase.config";
import {loginSchema} from "@/app/login/loginForm";
import {redirect} from "next/navigation";
import {signupSchema} from "@/app/signUp/signupForm";
export const api_user = {
    signUp:async (data:signupSchema)=>{
        try {
            const userCredential = createUserWithEmailAndPassword(auth, data.email, data.password)
            console.log('signIn Success')
        }catch (error){
            throw error
        }
    },
    signIn:async (data:loginSchema)=>{
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            console.log(userCredential);

        } catch (error) {
            throw error
        }
    }
}