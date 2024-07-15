import React from 'react';
import useUserStore from '@/stores/client/userStore';

const ClearStorageButton = () => {
    const clearStorage = () => {
        console.log('clearStorage called')
        localStorage.removeItem('user-store'); // 'user-store' 키를 삭제
    };

    const viewStorage = () => {
        console.log('viewStorage called')
        console.log("user-store = ", localStorage.getItem('user-store'))
    };
    return (<div className={'flex flex-col'}>
            <button type={'button'} onClick={clearStorage}>
                스토리지 비우기
            </button>
            <button type={'button'} onClick={viewStorage}>
                스토리지 보기
            </button>
        </div>
    );
};

export default ClearStorageButton;
