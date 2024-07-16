import {useState, ChangeEvent, useRef, useEffect} from "react";
import {BsPersonStanding} from "react-icons/bs";
import {GiMuscleUp} from "react-icons/gi";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {auth} from "@/firebase/firebase.client.config";
import {Textarea} from "@/components/ui/textarea";
import {bucketName} from "@/stores/store.config";
import Image from "next/image";
import {is} from "immutable";
import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import userProfileStore from "@/stores/client/userProfileStore";
import {handleImagePreview} from "@/lib/utils";

interface UserAspectTabContentProps {
    imgUrl: string;
    content: string;
    aspect: string;
    isEditing: boolean;
}

export default function UserAspectTabContent({imgUrl, content, aspect, isEditing}: UserAspectTabContentProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const itemRecordInputRef = useRef<HTMLInputElement>(null)
    const unitRecordInputRef = useRef<HTMLInputElement>(null)
    const {userProfilePage, addItemUnit, delItemUnit, immerSetField} = userProfileStore()

    const setPresentImgFile = (file) => {
        immerSetField(state => {
            state.images['present_img_file'] = file
        })
    }
    const setGoalImgFile = (file) => {
        immerSetField(state => {
            state.images['goal_img_file'] = file
        })
    }
    const setPresentImgUrl = (url) => {
        immerSetField(state => {
            state.userProfilePage.present.img = url
        })
    }
    const setGoalImgUrl = (url) => {
        immerSetField(state => {
            state.userProfilePage.goal.img = url
        })
    }

    const getItemUnit = (id, field) => {
        return userProfilePage.item_unit_arr.find(item => item.id === id)?.[field]
    }
    const onItemAdd = () => {
        const item = itemRecordInputRef.current?.value
        const unit = unitRecordInputRef.current?.value
        addItemUnit(item, unit)
    }
    const onItemDel = (id) => {
        delItemUnit(id)
    }

    type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    type InputChangeHandler = (e: InputChangeEvent, field: string, id?: number) => void;

    const handleInputChange: InputChangeHandler = (e, field, id) => {
        let recipe = null
        if (field === 'content') recipe = (state) => {
            state.userProfilePage[aspect].content = e.target.value
        }
        else if (field === 'item') {
            recipe = (state) => {
                console.log("id = ", id);
                state.userProfilePage.item_unit_arr.find(item => item.id === id).item = e.target.value;
            };
        } else if (field === 'unit') {
            recipe = (state) => {
                state.userProfilePage.item_unit_arr.find(item => item.id === id).unit = e.target.value;
            };
        } else if (field === 'value') {
            recipe = (state) => {
                state.userProfilePage[aspect].value_arr.find(item => item.id === id).value = e.target.value;
            };
        }
        immerSetField(recipe)
    };

    const aspectImg = userProfilePage[aspect].img;

    return (
        <div className={'userAspect flex flex-col items-center'}>
            {isEditing && <p>※ 이미지를 클릭하여 업로드</p>}
            <div className="image-area w-[250px] h-auto border-2 flex justify-center items-center rounded-2xl relative">
                {isEditing &&
                    <div
                        className="absolute inset-0 flex items-center justify-center opacity-60 cursor-pointer z-10">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                handleImagePreview(e, canvasRef, aspect=='present'?setPresentImgFile:setGoalImgFile, aspect=='present'?setPresentImgUrl:setGoalImgUrl);
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        />
                    </div>
                }
                <canvas ref={canvasRef} style={{display: 'none'}}></canvas>
                {
                    aspectImg ? (
                            <img
                                src={aspectImg}
                                alt="Preview"
                                style={{width: '100%', height: 'auto'}}
                                className={'rounded-2xl'}
                            />
                        )
                        : (
                            aspect === 'present' ?
                                <BsPersonStanding className={'w-full h-[400px] text-neutral-900 opacity-10'}/>
                                : aspect === 'goal' &&
                                <GiMuscleUp className={'w-full h-[400px] text-neutral-900 opacity-10'}/>
                        )
                }

            </div>
            <div className="user-tab-content mt-4 w-full">
                {isEditing ? (
                    <>
                        설명:
                        <Textarea defaultValue={content} onChange={(e) => handleInputChange(e, 'content')}/>
                    </>
                ) : (
                    <p>{content}</p>
                )}

            </div>
            <div className="user-tab-value_items mt-4 w-full">
                {
                    isEditing ? (
                            <>
                                항목추가 양식:
                                <div className={'xs:flex'}>
                                    <Card className="flex p-2 bg-gray-100 space-x-2">
                                        <div className="flex-[0.9]">
                                            <Input ref={itemRecordInputRef} className="w-full"
                                                   placeholder={'기록항목명 ex) 몸무게'}/>
                                        </div>
                                        <div className="flex-[0.5]">
                                            <Input ref={unitRecordInputRef} className="w-full" placeholder={'단위'}/>
                                        </div>
                                    </Card>
                                    <div className="flex xs:flex-col max-xs:justify-end xs:items-end space-x-2 max-xs:mt-1">
                                        <Button variant={'outline'}
                                                className={'bg-gray-100 xs:w-full xs:h-full'}>초기화</Button>
                                        <Button className={'bg-sky-700 xs:w-full xs:h-full'} onClick={onItemAdd}>추가</Button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    항목:
                                    {
                                        userProfilePage?.[aspect]?.['value_arr']?.map((data, index) => (
                                            <div key={index}>
                                                <Card className="p-2 bg-slate-800 space-y-1">
                                                    <Input className="w-full" defaultValue={getItemUnit(data.id, 'item')}
                                                           onChange={(e) => handleInputChange(e, 'item', data.id)}/>
                                                    <div className="flex space-x-2">
                                                        <div className="flex-[0.5]">
                                                            <Input className="w-full" defaultValue={data.value}
                                                                   onChange={(e) => handleInputChange(e, 'value', data.id)}/>
                                                        </div>
                                                        <div className="flex-[0.5]">
                                                            <Input className="w-full"
                                                                   defaultValue={getItemUnit(data.id, 'unit')}
                                                                   onChange={(e) => handleInputChange(e, 'unit', data.id)}/>
                                                        </div>
                                                    </div>
                                                </Card>
                                                <div className="flex justify-end">
                                                    <Button variant={'destructive'}
                                                            onClick={() => onItemDel(data.id)}>삭제</Button>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </>
                        )
                        : (
                            <>
                                <hr className={'mb-2'}/>
                                {
                                    userProfilePage?.[aspect]?.['value_arr']?.map((data, index) => (
                                        <div key={index} className="">
                                            <p className="">
                                                {getItemUnit(data.id, 'item')}: {data.value} {getItemUnit(data.id, 'unit')}
                                            </p>
                                        </div>
                                    ))
                                }
                            </>
                        )
                }
            </div>
        </div>
    );
}
