/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['http://localhost:3000', process.env.NEXT_PUBLIC_APP_DOMAIN], // 허용할 이미지 도메인 추가
    },
    async rewrites() {
        return [
            {
                source: '/',
                destination: '/main',
            },
            {
                source: '/api/:path*',
                destination: '/api/:path*',
            },
        ];
    },
};

module.exports= nextConfig;
