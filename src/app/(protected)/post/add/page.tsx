"use client"
import {useEffect, useRef} from "react";
import {handleAddPostPreview} from "@/lib/utils";
import {Card} from "@/components/ui/card";
import usePostStore from "@/stores/client/postStore";
import {useMediaQuery} from "react-responsive";
import Image from "next/image";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {itemAndUnit, PostAddSchema} from "@/lib/schemas";
import {Checkbox} from "@/components/ui/checkbox";
import {Progress} from "@/components/ui/progress";
import userStore from "@/stores/client/userStore";
import {Button} from "@/components/ui/button";
import {addPost} from "@/app/api/post/postService";
import {PROTECTED} from "@/lib/routes";
import {useRouter} from "next/navigation";

export default function PostAdd() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const {immerSetField, addPostData, tempData, resetStore} = usePostStore()
    const isXs = useMediaQuery({query: '(max-width: 480px)'});
    const {firestoreUser} = userStore()
    const queryClient = useQueryClient();
    const router = useRouter()

    const {mutate:postAddMutate, status:addStatus, error:addError} = useMutation({
        mutationFn: async (postToAdd:PostAddSchema) => addPost(postToAdd, tempData.imageFiles.mainPhoto),
        onSuccess: (res) => {
            console.log("addPost res = ", res);
            if(res.ok){
                queryClient.invalidateQueries({ queryKey: ['posts'] })
                alert('게시물 생성 완료')
                router.replace(PROTECTED.MAIN);
            }else{
                throw new Error(res?.message)
            }
        },
        onError: (error) => {
            // 에러 처리
            alert(`게시물 생성 실패: ${error}`);
        },
    })

    useEffect(() => {
        arrangeCheckedItems()

        return () => {
            resetStore()
        }
    }, []);
    const setPostImgFile = (file) => {
        immerSetField(state => {
            state.tempData.imageFiles.mainPhoto = file
        })
    }
    const setPostImgUrl = (url) => {
        immerSetField(state => {
            //임시 미리보기용
            state.addPostData.main_photo_url = url
        })
    }

    const handleInputChange = (e) => {
        immerSetField(state => {
            state.addPostData.content = e.target.value
        })
    }

    const handleChecked = (id, checked) => {
        immerSetField(state => {
            state.addPostData.checked_items[id] = checked
        })
    }

    const getAspectValue = (id, aspect) => {
        return firestoreUser?.[aspect].value_arr?.find(item => item.id === id)?.value
    }
    const calcProgress = (id) => {
        const value = getAspectValue(id, 'present')
        const max = getAspectValue(id, 'goal')
        return value / max * 100
    }

    const arrangeCheckedItems = () => {
        immerSetField(state => {
            state.addPostData.user_seq = firestoreUser.seq
        })
        const updateData = {}
        for (const el of firestoreUser['item_unit_arr']) {
            updateData[el.id] = false
        }
        immerSetField(state => {
            state.addPostData.checked_items = updateData
        })
    }

    const handleAddBtn = async () => {
        if(!addPostData.content){
            alert('내용을 입력해주세요.')
        }
        postAddMutate(addPostData)
    }
    return (
        <div id={'Post-add'}>
            <canvas ref={canvasRef} style={{display: 'none'}}></canvas>
            <div className="flex justify-center p-2">
                <div className="w-[300px] xs:w-[470px] flex flex-col items-center">
                    <div className="post-add__text text-2xl mb-4">
                        오늘의 게시물 추가
                    </div>
                    <div className="post-add__text mt-5">
                        1. 내용
                    </div>
                    <textarea className="w-[300px] xs:w-[470px] h-[200px] border p-2" defaultValue={addPostData.content}
                              onChange={(e) => handleInputChange(e)}
                    ></textarea>
                    <div className="post-add__text mt-5">
                        2. 사진
                    </div>
                    <Card id={'post-photo'}
                          className={'post-image-area w-[300px] h-[300px] xs:w-[470px] xs:h-[470px] relative'}>
                        <div className="absolute inset-0 flex items-center justify-center cursor-pointer z-10">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    handleAddPostPreview(e, canvasRef, setPostImgFile, setPostImgUrl, '470');
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                            />
                            {addPostData.main_photo_url ?
                                (
                                    <Image
                                        src={addPostData.main_photo_url}
                                        fill
                                        objectFit={'contain'}
                                        alt="게시할 이미지"
                                        style={{display: 'block', maxWidth: '100%'}}
                                    />
                                )
                                : (
                                    <div>※ 클릭하여 업로드</div>
                                )
                            }
                        </div>
                    </Card>
                    <div className="post-add__text mt-5">
                        3. 진척도 항목 선택
                    </div>
                    <div className="space-y-2">
                        {
                            firestoreUser?.['item_unit_arr']?.map((item: itemAndUnit, index) => (
                                <div className={'flex space-x-2 items-center'} key={'' + item.id}>
                                    <Checkbox id={'' + item.id}
                                              onCheckedChange={(checked) => handleChecked(item.id, checked)}/>
                                    <label htmlFor={'' + item.id} className={'flex items-center space-x-2'}>
                                        <Progress value={calcProgress(item.id)} className={'w-40 border'}/>
                                        <p className="">{item.item} :{getAspectValue(item.id, 'present')} → {getAspectValue(item.id, 'goal')} {item.unit}</p>
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                    <Button className={'mt-8 bg-sky-700 w-full'} onClick={handleAddBtn}>추가</Button>
                </div>
            </div>
            <div className="m-menubarH"></div>
        </div>
    );
}
