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
                port: '',
                search: '',
            },
        ],
        domains: ['backend.hotumatur.com'], // (Alternative) Allow images from specific domains
        deviceSizes: [320, 420, 768, 1024, 1200], // Define responsive image sizes
        imageSizes: [16, 32, 48, 64, 96], // Define fixed image sizes
    },
    // Optimizaciones de producción
    poweredByHeader: false,
    reactStrictMode: true,
}

module.exports = nextConfig 