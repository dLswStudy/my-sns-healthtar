"use client"
import { BsThreeDotsVertical } from "react-icons/bs";
import styled from 'styled-components';
import {
    MenubarSeparator,
} from "@/components/ui/menubar";
import useUserStore from "@/stores/client/userStore";
import {useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {removePost} from "@/app/client-api/post/postService";
import usePostStore from "@/stores/client/postStore";

const Button = styled.button`
  width: 100%;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
    color: #333;
  }
`;
export default function DotsMenuBtn({user_seq, postId, imgUrl}:{user_seq:number, postId:string, imgUrl:string}) {
    const {firestoreUser} = useUserStore()
    const isMe =  user_seq == firestoreUser.seq;
    const [menubarOpen, setMenubarOpen] = useState(false);
    const menubarRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter()
    const queryClient = useQueryClient();
    const {setField} = usePostStore()


    const {mutate: removePostRQ} = useMutation({
        mutationFn:()=>removePost(postId, imgUrl),
        onSuccess: async (res) => {
            console.log("removePost res = ", res);
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
        router.push(`/post/update/${postId}`)
    }
    const handleRemove = () => {
        if(confirm('정말 삭제하시겠습니까?')){
            removePostRQ()
        }

    }
    const handleMenubarOpen = () => {
        setMenubarOpen(!menubarOpen)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menubarRef.current && !menubarRef.current.contains(event.target as Node)) {
                setMenubarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menubarRef]);
    return (
        <div ref={menubarRef} className={'dots-menubar absolute'} style={{top: '15px', right: '15px'}}>
            <BsThreeDotsVertical onClick={handleMenubarOpen}/>
            <div className={cn('popover-sheet absolute mt-2 w-32 bg-white rounded-md shadow-lg overflow-hidden', menubarOpen ? 'block' : 'hidden')} style={{top:'20px',right:'-15px'}}>
                {isMe && <>
                    <Button className={'w-full'} onClick={handleModify}>수정</Button>
                    <MenubarSeparator/>
                    <Button className={'dots-menubar__content w-full'} onClick={handleRemove}>삭제</Button>
                </>}
            </div>
        </div>
    );
}
