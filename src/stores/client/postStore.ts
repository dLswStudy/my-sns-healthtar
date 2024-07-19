import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { produce } from "immer";
import {PostAddSchema, PostPutSchema} from "@/lib/schemas";

// Define the structure of each state part

type TempData = {
    imageFiles: {
        mainPhoto: File | null;
    };
    previewImgUrlToUpload: string;
}

type State = {
    addPostData: PostAddSchema;
    putPostData: PostPutSchema; // Reusing the same structure for simplicity
    tempData: TempData;
    routeToGo: string;
}

const initialState: State = {
    addPostData: {
        user_seq: -1,
        content: '',
        main_photo_url: '',
        checked_ids: {},
        hearts: [],
        comments: []
    },
    putPostData: {
        post_id: '',
        user_seq: -1,
        content: '',
        main_photo_url: '',
        checked_ids: {},
    },
    tempData: {
        imageFiles: {
            mainPhoto: null,
        },
        previewImgUrlToUpload:''
    },
    routeToGo:'',
};
type Actions = {
    setField: (field: string, value: any) => void;
    immerSetField: (recipe: (draft: any) => void) => void;
    resetStore: () => void;
};

const usePostStore = create<State & Actions>()(
    devtools(
        immer(
            (set) => ({
                ...initialState,
                setField: (field, value) => set(state => ({ [field]: value })),
                immerSetField: (recipe)=>set(produce(recipe)),
                resetStore: () => set(initialState),
            })
        )
    )
);

export default usePostStore;
