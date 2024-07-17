"use client"
import { BsThreeDotsVertical } from "react-icons/bs";
import styled from 'styled-components';
import {
    MenubarSeparator,
} from "@/components/ui/menubar";
import useUserStore from "@/stores/client/userStore";
import {useState} from "react";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {removePost} from "@/app/api/post/postService";
import {queryClient} from "@/app/_component/RQProvider";

const Button = styled.button`
  width: 100%;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
    color: #333;
  }
`;
export default function DotsMenuBtn({user_seq, postId}:{user_seq:number, postId:string}) {
    const {firestoreUser} = useUserStore()
    const isMe =  user_seq == firestoreUser.seq;
    const [menubarOpen, setMenubarOpen] = useState(false);
    const router = useRouter()


    const {mutate: removePostRQ} = useMutation({
        mutationFn:()=>removePost(postId),
        onSuccess: async (res) => {
            if(res.ok){
                await queryClient.invalidateQueries({ queryKey: ['posts','myPosts'] })
                alert('삭제되었습니다.')
                router.back()
            }else {
                throw new Error(res?.message)
            }
        },
        onError: (error) => {
            console.log("removePost error = ", error);
            // 에러 처리
            alert(`게시물 삭제 실패: ${error}`);
        },
    })

    const handleModify = () => {

    }
    const handleRemove = () => {
        if(confirm('정말 삭제하시겠습니까?')){
            removePostRQ()
        }

    }
    const handleMenubarOpen = () => {
        setMenubarOpen(!menubarOpen)
    }

    return (
        <div className={'dots-menubar absolute'} style={{top: '-20px', right: '26px'}}>
            <BsThreeDotsVertical onClick={handleMenubarOpen}/>
            <div className={cn('popover-sheet absolute mt-2 w-32 bg-white rounded-md shadow-lg overflow-hidden', menubarOpen ? 'block' : 'hidden')} style={{top:'20px',right:'-48px'}}>
                {isMe && <>
                    <Button className={'w-full'} onClick={handleModify}>수정</Button>
                    <MenubarSeparator/>
                    <Button className={'dots-menubar__content w-full'} onClick={handleRemove}>삭제</Button>
                </>}
            </div>
        </div>
    );
}
