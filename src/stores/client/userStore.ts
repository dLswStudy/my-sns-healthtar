import {create} from 'zustand';
import {User} from "@firebase/auth-types";
import {UserSchema} from "@/lib/schemas";
import { persist } from 'zustand/middleware';
import {log} from "node:util";
import {signupSchemaV2} from "@/app/(public)/signUp/_component/signupForm";

interface UserStoreState {
    authUser: User;  // Specify more detailed type if possible
    firestoreUser: UserSchema;
    signUpUser:signupSchemaV2;
    apiErrorMsg: {
        _signIn: string;
        _signUp: string;
    };
    setApiErrorMsg: (msg: string, type: 'signIn' | 'signUp') => void;
    clearAuthUser: () => void;
    setFirestoreUser: (user: any) => void;
    setSignUpUser: (user: any) => void;
    setAuthUser: (user: any) => void;
    emailVerified: boolean;
    setEmailVerified: (value: boolean) => void;
    emailBeforeAuth: string;
    setEmailBeforeAuth: (email: string) => void;
}

const useUserStore = create<UserStoreState>()(
    persist(
        (set, get) => ({
            authUser: null,
            firestoreUser:null,
            signUpUser:null,
            apiErrorMsg: {
                _signIn: '',
                _signUp: '',
            },
            emailVerified: false,
            emailBeforeAuth: '',
            setAuthUser: (authUser) => set({authUser}),
            setSignUpUser: (signUpUser) => set({signUpUser}),
            setEmailBeforeAuth: (emailBeforeAuth) => set({emailBeforeAuth}),
            clearAuthUser: () => set({authUser:null}),
            setFirestoreUser: (firestoreUser) => set({firestoreUser}),
            setEmailVerified: (value) => set({emailVerified: value}),
            setApiErrorMsg: (msg, type) => set((state) => {
                const updatedErrorMsg = { ...state.apiErrorMsg };
                if (type === 'signIn') {
                    updatedErrorMsg._signIn = msg;
                } else if (type === 'signUp') {
                    updatedErrorMsg._signUp = msg;
                }
                return { apiErrorMsg: updatedErrorMsg };
            }),
        }),
        {
            name: 'user-store',
        }
    )
);

export default useUserStore;
