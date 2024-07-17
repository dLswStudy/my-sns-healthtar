import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {produce} from "immer";

const initialState = {
    addPostData:{
        user_seq:null,
        main_photo_url:null,
        content:null,
        checked_items:{},
        hearts:[],
        comments:[]
    },
    tempData:{
        imageFiles:{
            mainPhoto:null,
        }
    }
};
const createSetters = (set) => ({
    setField: (field, value) => set(state => ({ [field]: value })),
    immerSetField: (recipe)=>set(produce(recipe)),
});

interface PostStoreState {
    addPostData;
    tempData;
    setField: (field: string, value: any) => void;
    immerSetField: (recipe: (draft: any) => void) => void;
    resetStore: () => void;
}

const usePostStore = create<PostStoreState>()(
    devtools(
        immer(
            (set) => ({
                ...initialState,
                ...createSetters(set),
                resetStore: () => set({ ...initialState })
            })
        )
    )
);

export default usePostStore;
