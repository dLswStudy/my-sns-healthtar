import {userProfilePageSchema} from "@/lib/schemas";
import {create} from "zustand";
import {devtools} from "zustand/middleware";
import useUserStore from "@/stores/client/userStore";

const createSetters = (set) => ({
    setField: (field, value) => set(state => ({ [field]: value })),
    setNestedField: (field, nestedField, value) => set(state => ({
        [field]: {
            ...state[field],
            [nestedField]: value
        }
    })),
    addItemUnit: (item, unit) => set(state => ({
        userProfilePage: {
            ...state.userProfilePage,
            units: [...state.userProfilePage.units, item]
        }
    }))
});
interface UserProfileStoreState {
    userProfilePage:userProfilePageSchema;
    setField: (field: string, value: any) => void;
    setNestedField: (field: string, nestedField: string, value: any) => void;
    addItemUnit: (item: string, unit: string) => void;
}

const useUserProfileStore = create<UserProfileStoreState>()(
    devtools(
        (set) => ({
            userProfilePage: null,
            ...createSetters(set)
        })
    )
);

export default useUserProfileStore;