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
                hostname: 'hotumatur.thefullstack.digital',
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