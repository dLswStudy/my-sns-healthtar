import {useState, ChangeEvent, useRef, useEffect} from "react";
import {BsPersonStanding} from "react-icons/bs";
import {GiMuscleUp} from "react-icons/gi";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {auth} from "@/firebase/firebase.client.config";
import {Textarea} from "@/components/ui/textarea";
import {bucketName} from "@/app.config";
import Image from "next/image";
import {is} from "immutable";
import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import userProfileStore from "@/stores/client/userProfileStore";

interface UserAspectTabContentProps {
    imgUrl: string;
    content: string;
    aspect: string;
    isEditing: boolean;
}

export default function UserAspectTabContent({imgUrl, content, aspect, isEditing}: UserAspectTabContentProps) {
    const newContentRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const itemRecordInputRef = useRef<HTMLInputElement>(null)
    const unitRecordInputRef = useRef<HTMLInputElement>(null)
    const {userProfilePage, addItemUnit, delItemUnit, immerSetField} = userProfileStore()
    const handleImagePreview = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log("original File: ", file);
            const previewUrl = URL.createObjectURL(file);

            // 이미지의 원본 크기를 읽어와서 캔버스에 그리기
            const img = new window.Image();
            img.src = previewUrl;
            img.onload = () => {
                const canvas = canvasRef.current;
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        // 설정하려는 부모 요소의 크기
                        const maxWidth = 250;
                        const aspectRatio = img.width / img.height;
                        const width = maxWidth;
                        const height = maxWidth / aspectRatio;

                        // 캔버스 크기 설정
                        canvas.width = width;
                        canvas.height = height;

                        // 이미지 캔버스에 그리기
                        ctx.drawImage(img, 0, 0, width, height);

                        // 캔버스에서 Blob 객체로 변환
                        canvas.toBlob((blob) => {
                            if (blob) {
                                const resizedFile = new File([blob], file.name, {
                                    type: file.type,
                                });
                                const resizedImgUrl = URL.createObjectURL(resizedFile);
                                immerSetField(state => {
                                    state.userProfilePage[aspect].img = resizedImgUrl
                                })
                                console.log("Resized File: ", resizedFile);
                            }
                        }, file.type);
                    }
                }
            };
        }
    };

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
                            ref={fileInputRef}
                            onChange={(e) => {
                                handleImagePreview(e);
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
