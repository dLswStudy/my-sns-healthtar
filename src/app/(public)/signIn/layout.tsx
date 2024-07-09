import Image from 'next/image'
import mably from '@/assets/img/마블리.jpeg'

export default function LoginMainLayout({children}) {
    return (
        <div id="login" className="login flex w-auto h-max mt-16">
            <div className="login-left
                                flex items-center justify-end w-1/2 px-4
                                max-md:hidden">
                <div>
                    <Image src={mably} alt="마블리" className="rounded-xl w-80"/>
                </div>
            </div>
            <div className="login-right
                                flex items-center px-4
                                max-md:justify-center max-md:w-full
                                md:w-1/2 md:justify-start">
                {children}
            </div>
        </div>
    );
};