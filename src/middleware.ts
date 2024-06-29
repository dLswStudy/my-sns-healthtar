import { NextResponse, NextRequest } from 'next/server';
import {auth} from "@/firebase/firebase.config";

export function middleware(request: NextRequest) {
    const user = auth.currentUser
    console.log("user = ", user);
    const isAuthenticated = Boolean(user)

    const url = request.nextUrl.clone();

    // '/' 또는 '' 경로로 들어왔을 때 로그인 여부 확인
    if (!isAuthenticated && (url.pathname === '/' || url.pathname === '')) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/'],
};
