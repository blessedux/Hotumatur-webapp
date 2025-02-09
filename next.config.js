/** @type {import('next').NextConfig} */
const nextConfig = {

    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'backend.hotumatur.com',
                pathname: '/wp-content/uploads/**',
            },
        ],
    },
    // Optimizaciones de producción
    poweredByHeader: false,
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://backend.hotumatur.com/wp-json/wc/v3/:path*',
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; media-src 'self' data: https:;"
                    }
                ]
            }
        ]
    }
}

module.exports = nextConfig;


