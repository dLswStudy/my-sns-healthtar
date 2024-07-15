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
    const [newImgUrl, setNewImgUrl] = useState(imgUrl);
    const newContentRef = useRef<HTMLTextAreaElement>(null);
    const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imageAreaHeight, setImageAreaHeight] = useState('400px')
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [imgDimensions, setImgDimensions] = useState({width: 1, height: 1});
    const [resizedFile, setResizedFile] = useState<File | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const {userProfilePage, addItemUnit} = userProfileStore()
    const itemRecordInputRef = useRef<HTMLInputElement>(null)
    const unitRecordInputRef = useRef<HTMLInputElement>(null)
    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const storage = getStorage();
            const storageRef = ref(storage, `${bucketName}/profile-images/${auth.currentUser?.uid}/${aspect}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setNewImgUrl(url);
        }
    };
    const handleImagePreview = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log("original File: ", file);
            const previewUrl = URL.createObjectURL(file);
            setPreviewImgUrl(previewUrl);

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
                                setResizedFile(resizedFile);
                                console.log("Resized File: ", resizedFile);
                            }
                        }, file.type);
                    }
                }
            };
        }
    };

    const getItemUnit = (id,field)=>{
        return userProfilePage.item_unit_arr.find(item=>item.id===id)?.[field]
    }
    const onItemAdd = ()=>{
        const item = itemRecordInputRef.current?.value
        const unit = unitRecordInputRef.current?.value
        addItemUnit(item, unit)
    }

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
                {newImgUrl && (
                    <Image
                        ref={imageRef}
                        src={newImgUrl}
                        alt="aspect"
                        layout="responsive"
                        width={imgDimensions.width}
                        height={imgDimensions.height}
                        className="rounded-2xl"
                    />
                )}
                <canvas ref={canvasRef} style={{display: 'none'}}></canvas>
                {isEditing && previewImgUrl && (
                    <img
                        src={previewImgUrl}
                        alt="Preview"
                        style={{width: '100%', height: 'auto'}}
                        className={'rounded-2xl'}
                    />
                )}
                {aspect === 'present' && !newImgUrl && !previewImgUrl &&
                    <BsPersonStanding className={'w-full h-[400px] text-neutral-900 opacity-10'}/>}
                {aspect === 'goal' && !newImgUrl && !previewImgUrl &&
                    <GiMuscleUp className={'w-full h-[400px] text-neutral-900 opacity-10'}/>}
            </div>
            <div className="user-tab-content mt-4 w-full">
                {isEditing ? (
                    <>
                        설명:
                        <Textarea ref={newContentRef} defaultValue={content}/>
                    </>
                ) : (
                    <p>{content}</p>
                )}

            </div>
            <div className="user-tab-value_items mt-4 w-full">
                항목:
                {
                    isEditing && (
                        <>
                            <div className={'xs:flex'}>
                                    <Card className="flex p-2 bg-gray-100 space-x-2">
                                        <div className="flex-[0.9]">
                                            <Input ref={itemRecordInputRef} className="w-full" placeholder={'기록항목명 ex) 몸무게'}/>
                                        </div>
                                        <div className="flex-[0.5]">
                                            <Input ref={unitRecordInputRef} className="w-full" placeholder={'단위'}/>
                                        </div>
                                    </Card>
                                <div className="flex xs:flex-col max-xs:justify-end xs:items-end space-x-2 max-xs:mt-1">
                                    <Button variant={'outline'} className={'bg-gray-100 xs:w-full xs:h-full'}>초기화</Button>
                                    <Button className={'bg-sky-700 xs:w-full xs:h-full'} onClick={onItemAdd}>추가</Button>
                                </div>
                            </div>
                            <div className="mt-2">
                                {
                                    userProfilePage?.[aspect]?.['value_arr']?.map((data, index) => (
                                        <div key={index}>
                                            <Card className="p-2 bg-slate-800 space-y-1">
                                                <Input className="w-full" value={getItemUnit(data.id, 'item')}/>
                                                <div className="flex space-x-2">
                                                    <div className="flex-[0.5]">
                                                        <Input className="w-full" value={data.value}/>
                                                    </div>
                                                    <div className="flex-[0.5]">
                                                        <Input className="w-full" value={getItemUnit(data.id, 'unit')}/>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                    )
                }
                <div>
                    <Input value={'asdfqwer'} className={'max-w-fit'}/>
                    <Button variant={'destructive'}>삭제</Button>
                </div>
            </div>
        </div>
    );
}
