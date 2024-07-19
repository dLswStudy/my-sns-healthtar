// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {ReactNode, useState} from 'react';
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true, // 윈도우가 다시 포커스되었을때 데이터를 refetch
            refetchOnMount: false, // 데이터가 stale 상태이면 컴포넌트가 마운트될 때 refetch
            retry: 1, // API 요청 실패시 재시도 하는 옵션 (설정값 만큼 재시도)
            staleTime:300000, //5분동안 fresh 상태유지
            gcTime: 3600000, //캐시에서 1시간 뒤 가비지 컬렉팅
        },
    },
});

export default function RQProviders({ children }: { children: ReactNode }) {
    const [client] = useState(queryClient);
    return (
        <QueryClientProvider client={client}>
            {children}
            {
                process.env.NODE_ENV === 'development' &&
                <ReactQueryDevtools initialIsOpen={true} />
            }
        </QueryClientProvider>
    );
}
