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
};