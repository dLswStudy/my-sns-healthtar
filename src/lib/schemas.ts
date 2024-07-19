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

type Heart = { time: string, user_seq: number };
type Comment = { time: string, user_seq: number, content: string };
export type PostAddSchema = {
    user_seq:number,
    content:string,
    main_photo_url?:string,
    checked_ids:{[key:number]:boolean}
    hearts:Array<Heart>
    comments:Array<Comment>
}
export type PostPutSchema = Omit<PostAddSchema, 'comments' | 'hearts'>  & {
    post_id:string
}
export type PostDetailSchema = Omit<PostAddSchema, 'checked_ids'> & {
    post_id:string
    progress_info_arr:Array<ProgressInfo>,
    profile_image_url:string,
    nickname:string,
    createdAt:string,
    updatedAt:string,
}
export type ProgressInfo = {
    id:number,
    item:string,
    goalValue:number,
    presentValue:number,
    unit:string
}

export type SetFirestoreUser = (user: UserSchema) => void;

export type CustomResponse = {
    message:string,
    ok:boolean,
    data?:any
}