/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['hotumatur.thefullstack.digital', 'images.pexels.com', 'media-cdn.tripadvisor.com', 'backend.hotumatur.com']
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig 