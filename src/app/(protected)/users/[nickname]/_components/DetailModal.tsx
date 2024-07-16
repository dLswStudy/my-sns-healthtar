import { useRouter } from 'next/router';

function CartModal({ isOpen, children }) {
    const router = useRouter();

    return (
        <div className={isOpen ? 'open' : 'closed'}>
            {children}
            <button onClick={() => router.push('/shop')}>계속 쇼핑하기</button>
            <button onClick={() => router.push('/checkout')}>결제하기</button>
        </div>
    );
}

export default CartModal;