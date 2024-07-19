"use client"
import {useEffect, useRef} from "react";
import {countValueInObject, handleAddPostPreview} from "@/lib/utils";
import {Card} from "@/components/ui/card";
import usePostStore from "@/stores/client/postStore";
import {useMediaQuery} from "react-responsive";
import Image from "next/image";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {itemAndUnit, PostAddSchema, PostPutSchema, userProfilePageSchema} from "@/lib/schemas";
import {Checkbox} from "@/components/ui/checkbox";
import {Progress} from "@/components/ui/progress";
import userStore from "@/stores/client/userStore";
import {Button} from "@/components/ui/button";
import {addPost, getPostOne, putPost} from "@/app/client-api/post/postService";
import {PROTECTED} from "@/lib/routes";
import {useRouter} from "next/navigation";
import {getUserByNickname} from "@/lib/auth";
import {put} from "@jridgewell/set-array";
type Props = {
    params: {
        postId: string
    }
}
export default function PostUpdate({params}:Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const {immerSetField, putPostData, tempData, resetStore} = usePostStore()
    const {firestoreUser} = userStore()
    const queryClient = useQueryClient();
    const router = useRouter()

    const {data: putPostDataRQ, status, error, isSuccess} = useQuery({
        queryKey: ['postOne', params.postId],
        queryFn: async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_APP_DOMAIN}/api/post/getPutPost/${params.postId}`,{cache:'no-store'}
            )
            return await response.json()
        },
        staleTime:0,
        gcTime:0
    });
    console.log("putPostDataRQ = ", putPostDataRQ);
    console.log("isSuccess = ", isSuccess);
    console.log("status = ", status);
    
    const {mutateAsync:postPutMutate, status:addStatus, error:addError} = useMutation({
        mutationFn: async (postToPut:PostPutSchema) => putPost(postToPut, tempData.imageFiles.mainPhoto),
        onSuccess: async (res) => {
            console.log("addPost res = ", res);
            if(res.ok){
                await queryClient.invalidateQueries({ queryKey: ['posts','myPosts'] })
                alert('게시물 수정 완료')
                router.replace(PROTECTED.MAIN);
            }else{
                throw new Error(res?.message)
            }
        },
        onError: (error) => {
            console.log("error = ", error);
            // 에러 처리
            alert(`게시물 수정 실패`);
        },
    })

    useEffect(() => {
        console.log('%cMOUNTED update post page','color:green');

        if(putPostDataRQ)
            arrangePutPostData()

        return () => {
            console.log('%cUNMOUNT update post page','color:red');
            resetStore()
        }
    }, [isSuccess]);
    const setPostImgFile = (file) => {
        immerSetField(state => {
            state.tempData.imageFiles.mainPhoto = file
        })
    }
    const setPostImgUrl = (url) => {
        immerSetField(state => {
            //임시 미리보기용
            state.tempData.previewImgUrlToUpload = url
        })
    }

    const handleInputChange = (e) => {
        immerSetField(state => {
            state.putPostData.content = e.target.value
        })
    }

    const handleChecked = (id, checked) => {
        immerSetField(state => {
            state.putPostData.checked_ids[id] = checked
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

    let chkCnt = 0
    const arrangePutPostData = () => {
        immerSetField( (state) => {
            state.putPostData = putPostDataRQ
            state.tempData.previewImgUrlToUpload = putPostDataRQ.main_photo_url
        })
        // const cheked = {}
        // if(firestoreUser?.['item_unit_arr']?.length){
        //     for (const el of firestoreUser['item_unit_arr']) {
        //         cheked[el.id] = false
        //     }
        //     console.log("cheked = ", cheked);
        //     immerSetField(state => {
        //         state.putPostData.checked_ids = cheked
        //     })
        // }
        chkCnt = countValueInObject(putPostData.checked_ids, true)
        // for (const bool of p)
    }

    const handleAddBtn = async () => {
        if(!putPostData.content){
            alert('내용을 입력해주세요.')
        }
        await postPutMutate(putPostData)
    }

    return (
        <div id={'Post-add'}>
            <canvas ref={canvasRef} style={{display: 'none'}}></canvas>
            <div className="flex justify-center p-2">
                <div className="w-[300px] xs:w-[470px] flex flex-col items-center">
                    <div className="post-add__text text-2xl mb-4">
                        게시물 수정
                    </div>
                    <div className="post-add__text mt-5">
                        1. 내용
                    </div>
                    <textarea className="w-[300px] xs:w-[470px] h-[200px] border p-2" defaultValue={putPostData.content}
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
                            {putPostData.main_photo_url ?
                                (
                                    <Image
                                        src={tempData.previewImgUrlToUpload}
                                        fill
                                        alt="게시할 이미지"
                                        style={{objectFit: 'contain',display: 'block', maxWidth: '100%'}}
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
                            !chkCnt
                            && <p>진척도를 체크할 항목이 없습니다. 다음 안내 사항을 따라서 진척도 항목을 추가해주세요.<br/>
                                ※사용자 정보 → 프로필 편집 → 항목 추가 → 프로필 저장
                            </p>
                        }
                        {
                            firestoreUser?.['item_unit_arr']?.map((item: itemAndUnit, index) => (
                                <div className={'flex space-x-2 items-center'} key={'' + item.id}>
                                    <Checkbox id={'' + item.id}
                                              checked={putPostData.checked_ids[''+item.id]}
                                              onCheckedChange={(checked) => handleChecked(item.id, checked)}/>
                                    <label htmlFor={'' + item.id} className={'flex items-center space-x-2'}>
                                        <Progress value={calcProgress(item.id)} className={'w-40 border'}/>
                                        <p className="">{item.item} :{getAspectValue(item.id, 'present')} → {getAspectValue(item.id, 'goal')} {item.unit}</p>
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                    <Button className={'mt-8 bg-sky-700 w-full'} onClick={handleAddBtn}>게시물 수정</Button>
                </div>
            </div>
            <div className="m-menubarH"></div>
        </div>
    );
}
