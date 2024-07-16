import { ReactNode } from 'react';
import { useRouter } from 'next/router';

type PostDetailModalProps = {
    children: ReactNode;
};

export function PostDetailModal({ children }: PostDetailModalProps) {
    const router = useRouter();

    const closeModal = () => {
        router.back();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <button onClick={closeModal} className="absolute top-2 right-2">
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}
