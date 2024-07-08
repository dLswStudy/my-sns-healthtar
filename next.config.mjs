/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['https://localhost:3000'], // 허용할 이미지 도메인 추가
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: '/api/:path*',
            },
        ];
    },
};

export default nextConfig;
