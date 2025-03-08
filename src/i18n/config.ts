'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly
import commonES from '../../public/locales/es/common.json';
import commonEN from '../../public/locales/en/common.json';

const resources = {
    es: {
        translation: commonES
    },
    en: {
        translation: commonEN
    }
};

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        debug: process.env.NODE_ENV === 'development',
        fallbackLng: 'es',
        supportedLngs: ['es', 'en'],
        defaultNS: 'translation',
        fallbackNS: 'translation',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n; 