import exp from "node:constants";
export type Put<T, R> = Omit<T, keyof R> & R;

export type UserSchema = {
    seq: number;
    email: string;
    name: string;
    nickname: string;
    profile_image_url: string;
    gender: string;
    helloword: string;
    birth: string;
    createdAt: string;
    updatedAt: string;

    post?: number[];
    followers?: number[];
    followings?: number[];

    present?:{
        img:string;
        content:string;
        value_arr:Array<valueAndId>;
    }
    goal?:{
        img:string;
        content:string;
        value_arr:Array<valueAndId>;
    }
    item_unit_arr?:Array<itemAndUnit>;
    ids?:{
        itemAndUnit:number;
    }
};

type arrayToNumN1 = {
    posts:number;
    followers: number;
    followings: number;
}
export type userProfilePageSchema = Put<UserSchema, arrayToNumN1>

export type valueAndId = {
    id:number;
    value:number;
}
export type itemAndUnit = {
    id:number;
    item:string;
    unit:string;
}

export type UserProfileImagesSchema={
    profile_img_file:File;
    present_img_file:File;
    goal_img_file:File;
}

export type GetRecordItemsResponse = {
    present_value_arr: Array<valueAndId>;
    goal_value_arr: Array<valueAndId>;
    item_unit_arr: Array<itemAndUnit>;
}

export type PostAddSchema = {
    user_seq:number,
    content:string,
    main_photo_url?:string,
    checked_items?:{[key:string]:boolean}
    hearts?:[{time:string, user_seq:number}]|[]
    comments?:[{time:string, user_seq:number, content:string}]|[]
}

export type SetFirestoreUser = (user: UserSchema) => void;

