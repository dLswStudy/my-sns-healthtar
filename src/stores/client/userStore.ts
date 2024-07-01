import create from 'zustand';

const userStore = create((set) => ({
    user: {},
    errorMsg:{
        _signIn:'',
        _signUp:'',
    },
    setErrorMsg: (msg, type) => set((state) => {
        switch (type) {
            case 'signIn':
                return { errorMsg: { ...state.errorMsg, _signIn: msg } };
            case 'signUp':
                return { errorMsg: { ...state.errorMsg, _signUp: msg } };
            default:
                return state;
        }
        console.log("state.errorMsg._signIn = ", state.errorMsg._signIn);
    }),
}));

export default userStore;