import type { Metadata } from 'next';

const siteConfig = {
    title: 'Hotumatur: Rapa Nui',
    description: 'Agencia de turismo en Rapa Nui',
    url: 'https://hotumatur.com',
    ogImage: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/Hotumatur-android-chrome-512x512-1.png',
};

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.title,
        template: `%s | ${siteConfig.title}`,
    },
    description: siteConfig.description,
    openGraph: {
        type: 'website',
        locale: 'es_CL',
        alternateLocale: 'en_US',
        url: '/',
        siteName: siteConfig.title,
        title: {
            default: siteConfig.title,
            template: `%s | ${siteConfig.title}`,
        },
        description: siteConfig.description,
        images: [{
            url: siteConfig.ogImage,
            width: 512,
            height: 512,
            alt: siteConfig.title,
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: {
            default: siteConfig.title,
            template: `%s | ${siteConfig.title}`,
        },
        description: siteConfig.description,
        images: [siteConfig.ogImage],
    },
    alternates: {
        canonical: '/',
        languages: {
            'es-CL': '/',
            'en-US': '/en',
        },
    },
}; 