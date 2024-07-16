import {UserProfileImagesSchema, userProfilePageSchema} from "@/lib/schemas";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {produce} from "immer";

const initialState = {
    images:{
        profile_img_file:null,
        present_img_file:null,
        goal_img_file:null,
    },
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
    userProfilePage: userProfilePageSchema;
    images:UserProfileImagesSchema;

    setField: (field: string, value: any) => void;
    setNestedField: (field: string, nestedField: string, value: any) => void;
    addItemUnit: (item: string, unit: string) => void;
    delItemUnit: (id: number) => void;
    immerSetField: (recipe: (draft: any) => void) => void;
}

const useUserProfileStore = create<UserProfileStoreState>()(
    devtools(
        immer(
            (set) => ({
                userProfilePage: null, //프로필 업데이트 용
                images:initialState.images, //임시저장
                ...createSetters(set)
            })
        )
    )
);

export default useUserProfileStore;
