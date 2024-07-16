'use client';

import { type ElementRef, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

export default function DetailPostModal({ postId }: { postId:string }) {
    console.log('%cDetailPostModal',"color:blue")
    const router = useRouter();
    const dialogRef = useRef<ElementRef<'dialog'>>(null);

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showPopover();
        }
    }, []);

    function onDismiss() {
        router.back();
    }

    return createPortal(
        <div className="modal-backdrop">
            <dialog ref={dialogRef} className="modal" onClose={onDismiss} popover={'auto'}>
                <>
                    <div>dkdkdkdkdkdkdklweofwoeifjno</div>
                    <div>postId:{postId}</div>
                    <button onClick={onDismiss} className="close-button" />
                </>
            </dialog>
        </div>,
        document.getElementById('modal-root')!
    );
}