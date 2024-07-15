import {create} from 'zustand';
import {User} from "@firebase/auth-types";
import { UserSchema} from "@/lib/schemas";
import {devtools, persist} from 'zustand/middleware';
import {signupSchemaV2} from "@/app/(public)/signUp/_component/signupForm";


// 유틸리티 함수 정의
const createSetters = (set) => ({
    setField: (field, value) => set(state => ({ [field]: value })),
    setNestedField: (field, nestedField, value) => set(state => ({
        [field]: {
            ...state[field],
            [nestedField]: value
        }
    })),
    asyncSetField: async (field, newValue) => {
        return new Promise((resolve) => {
            const unsubscribe = useUserStore.subscribe((state) => {
                if (state[field] === newValue) {
                    console.log('now asyncSetField')
                    unsubscribe();
                    resolve(newValue);
                }else{
                    console.log('asyncSetField')
                }
            });
            set(state => ({[field]: newValue}));
        });
    },
    waitAndExec : (field, callback) => {
        console.log('userStore asyncWait')
        const unsubscribe = useUserStore.subscribe((state) => {
            console.log("state[field] = ", state[field]);
            if (state[field] !== null) {
                console.log('asyncWait state[field] !== null')
                callback()
                unsubscribe()
            }
        });
    }
});



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
    setField: (field: string, value: any) => void;
    setNestedField: (field: string, nestedField: string, value: any) => void;
    asyncSetField: (field: string, newValue: any) => Promise<unknown>;
    waitAndExec: (field: string, callback:Function) => void;
}

const useUserStore = create<UserStoreState>()(
    devtools(
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

                userProfilePage:null,

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
                ...createSetters(set), // 유틸리티 함수로 생성된 setter 함수들
            }),
            {
                name: 'user-store',
            }
        )
    )
);

export default useUserStore;
