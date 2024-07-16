import React from 'react';
import {  User,CirclePlus } from 'lucide-react'; // 아이콘은 lucide-react를 사용하였습니다. 필요에 따라 다른 아이콘 라이브러리를 사용할 수 있습니다.
import { CgFeed   } from "react-icons/cg";
import { MdOutlinePersonSearch  } from "react-icons/md";
import Link from "next/link";
import {PROTECTED} from "@/lib/routes";
const MobileNavigator = () => {
    return (
        <div className="m-navi fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around items-center m-menubarH border-t z-50">
            <button aria-label="Feed">
                <Link href={PROTECTED.MAIN}>
                    <CgFeed className="w-6 h-6"/>
                </Link>
            </button>
            <button aria-label="PersonSearch">
                <MdOutlinePersonSearch className="w-6 h-6"/>
            </button>
            <button aria-label="User" className="relative">
                <Link href={PROTECTED.PROFILE}>
                    <User className="icon_user w-6 h-6"/>
                </Link>
            </button>
            <button aria-label="PostAdd">
                <Link href={PROTECTED.POST_ADD}>
                    <CirclePlus className="w-6 h-6"/>
                </Link>
            </button>
        </div>
    );
};

export default MobileNavigator;