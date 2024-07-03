import {actionCodeSettings, auth, sendSignInLinkToEmail, signInWithEmailAndPassword} from "@/firebase/firebase.config";
import {loginSchema} from "@/app/login/loginForm";
import {signupSchemaV2} from "@/app/signUp/signupForm";
export const api_user = {
    signUp:async (data:signupSchemaV2)=>{
        try {
            const userCredential = await sendSignInLinkToEmail (auth, data.email, actionCodeSettings)
            console.log('signUp Success', userCredential)
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
            console.log("auth.currentUser = ", auth.currentUser);
        } catch (error) {
            throw error
        }
    }
}