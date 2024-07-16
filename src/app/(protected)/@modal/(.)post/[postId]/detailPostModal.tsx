'use client';

import {type ElementRef, useEffect, useRef, useState} from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import AntdModal from "@/components/ui/antdModal";
import Potal from "@/app/_component/Potal";

export function DetailPostModal({ children }: { children: React.ReactNode}) {
    console.log('%cDetailPostModal',"color:blue")
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(true);

    useEffect(() => {
    }, []);

    function onDismiss() {
        setIsModalOpen(false);
        router.back();
    }

    return createPortal(
        <AntdModal title={'게시물'}
            onCancel={onDismiss}
            open={isModalOpen}
        >
            {children}
        </AntdModal>,
        document.getElementById('portal')!
    );
}