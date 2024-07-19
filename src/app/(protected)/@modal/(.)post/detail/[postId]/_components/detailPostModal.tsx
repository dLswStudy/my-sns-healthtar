'use client';

import usePreventScroll from "@/lib/hooks/usePreventsScroll";
import {type ElementRef, useEffect, useRef, useState} from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import AntdModal from "@/components/ui/antdModal";
import usePostStore from "@/stores/client/postStore";

export function DetailPostModal({ children, title }: { children: React.ReactNode, title:React.ReactNode}) {
    console.log('%cDetailPostModal',"color:blue")
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(true);
    usePreventScroll(isModalOpen)

    function onDetailPopupClose() {
        setIsModalOpen(false);
        router.back();
    }

    return createPortal(
        <AntdModal title={title}
            onCancel={onDetailPopupClose}
            open={isModalOpen}
        >
            {children}
        </AntdModal>,
        document.getElementById('portal')!
    );
}