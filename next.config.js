/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'backend.hotumatur.com',
                pathname: '/wp-content/uploads/**',
                port: '',
                search: '',
            },
        ],
    },
    // Optimizaciones de producción
    poweredByHeader: false,
    reactStrictMode: true,
}

module.exports = nextConfig 