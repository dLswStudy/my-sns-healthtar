import {create} from 'zustand';

interface UserStoreState {
    user: any;  // Specify more detailed type if possible
    apiErrorMsg: {
        _signIn: string;
        _signUp: string;
    };
    setApiErrorMsg: (msg: string, type: 'signIn' | 'signUp') => void;
    setUser: (user: any) => void;
    emailVerified: boolean;
}

const useUserStore = create<UserStoreState>((set) => ({
    user: {},
    apiErrorMsg: {
        _signIn: '',
        _signUp: '',
    },
    emailVerified: false,
    setEmailVerified: (value) => set((state) => ({ ...state, emailVerified: value })),
    setUser: (user) => set((state) => ({ ...state, user })),
    setApiErrorMsg: (msg, type) => set((state) => {
        switch (type) {
            case 'signIn':
                return { apiErrorMsg: { ...state.apiErrorMsg, _signIn: msg } };
            case 'signUp':
                return { apiErrorMsg: { ...state.apiErrorMsg, _signUp: msg } };
            default:
                return state;
        }
    }),
}));

export default useUserStore;
