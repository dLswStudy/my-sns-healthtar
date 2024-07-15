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
    followers?: number[];
    followings?: number[];
    present_img:string;
    present_content:string;
    goal_img:string;
    goal_content:string;
};

export type userProfilePageSchema = {
    seq: number;
    name: string;
    nickname: string;
    profile_image_url: string;
    gender: string;
    helloword: string;
    birth: string;
    createdAt: string;
    updatedAt: string;
    posts:number;
    followers: number;
    followings: number;
    present:{
        img:string;
        content:string;
        value_arr:Array<valueAndId>;
    }
    goal:{
        img:string;
        content:string;
        value_arr:Array<valueAndId>;
    }
    item_unit_arr:Array<itemAndUnit>;
    id:{
        itemAndUnit:number;
    }
};

type valueAndId = {
    id:number;
    value:number;
}
type itemAndUnit = {
    id:number;
    item:string;
    unit:string;
}