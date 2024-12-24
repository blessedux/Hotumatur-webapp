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
            },
        ],
    },
    // Optimizaciones de producción
    poweredByHeader: false,
    reactStrictMode: true,
}

// Add environment variables without overwriting existing configuration
module.exports = {
    ...nextConfig, // Spread existing config
    env: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_WC_API_URL: process.env.NEXT_PUBLIC_WC_API_URL,
        WC_CONSUMER_KEY: process.env.WC_CONSUMER_KEY,
        WC_CONSUMER_SECRET: process.env.WC_CONSUMER_SECRET,
    },
};