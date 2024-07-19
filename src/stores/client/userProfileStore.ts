import {itemAndUnit, UserProfileImagesSchema, userProfilePageSchema, valueAndId} from "@/lib/schemas";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {produce} from "immer";

const initialState = {
    userProfilePage:{
        seq: null,
        email: '',
        name: '',
        nickname: '',
        profile_image_url: '',
        gender: '',
        helloword: '',
        birth: '',
        createdAt: '',
        updatedAt: '',

        post: [],
        followers: [],
        followings: [],

        present:{
            img:'',
            content:'',
            value_arr:[],
        },
        goal:{
            img:'',
            content:'',
            value_arr:[],
        },
        item_unit_arr:[],
        ids:{
            itemAndUnit:null,
        }
    },
    images:{
        profile_img_file:null,
        present_img_file:null,
        goal_img_file:null,
    },
    myPosts:[]
};
const createSetters = (set) => ({
    setField: (field, value) => set(state => ({ [field]: value })),
    setNestedField: (field, nestedField, value) => set(state => {
        state[field][nestedField] = value;
    }),
    immerSetField: (recipe)=>set(produce(recipe)),
    addItemUnit: (item, unit) => set(state => {
        const id = state.userProfilePage.ids.itemAndUnit;
        const newItemUnit = { id: id, item, unit };
        state.userProfilePage.item_unit_arr.push(newItemUnit);
        state.userProfilePage.ids.itemAndUnit += 1;
        state.userProfilePage.present.value_arr.push({id,value:0})
        state.userProfilePage.goal.value_arr.push({id,value:0})
    }),
    delItemUnit: (id) => set(state => {
        state.userProfilePage.item_unit_arr = state.userProfilePage.item_unit_arr.filter(itemUnit => itemUnit.id !== id);
        state.userProfilePage.present.value_arr = state.userProfilePage.present.value_arr.filter(value => value.id !== id);
        state.userProfilePage.goal.value_arr = state.userProfilePage.goal.value_arr.filter(value => value.id !== id);
    })
});

interface UserProfileStoreState {
    userProfilePage;
    images;
    myPosts;

    setField: (field: string, value: any) => void;
    setNestedField: (field: string, nestedField: string, value: any) => void;
    addItemUnit: (item: string, unit: string) => void;
    delItemUnit: (id: number) => void;
    immerSetField: (recipe: (draft: any) => void) => void;
    resetStore: () => void;
}

const useUserProfileStore = create<UserProfileStoreState>()(
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

export default useUserProfileStore;
