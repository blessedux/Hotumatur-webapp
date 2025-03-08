'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files directly
import commonES from '../locales/es/common.json';
import commonEN from '../locales/en/common.json';
import bookingES from '../locales/es/booking.json';
import bookingEN from '../locales/en/booking.json';
import tourSectionES from '../locales/es/tour_section.json';
import tourSectionEN from '../locales/en/tour_section.json';
import footerES from '../locales/es/footer.json';
import footerEN from '../locales/en/footer.json';

// Import public locales
import publicCommonEN from '../../public/locales/en/common.json';
import publicCommonES from '../../public/locales/es/common.json';

// Merge the translations from src/locales and public/locales
const mergedCommonEN = { ...commonEN, ...publicCommonEN };
const mergedCommonES = { ...commonES, ...publicCommonES };

const resources = {
    es: {
        common: mergedCommonES,
        booking: bookingES,
        tour_section: tourSectionES,
        footer: footerES
    },
    en: {
        common: mergedCommonEN,
        booking: bookingEN,
        tour_section: tourSectionEN,
        footer: footerEN
    }
};

console.log('Merged translations:', {
    en: {
        testimonials: mergedCommonEN.testimonials,
        pre_footer: mergedCommonEN.pre_footer
    },
    es: {
        testimonials: mergedCommonES.testimonials,
        pre_footer: mergedCommonES.pre_footer
    }
});

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
        resources,
        debug: process.env.NODE_ENV === 'development',
        fallbackLng: 'es',
        supportedLngs: ['es', 'en'],
        defaultNS: 'common',
        fallbackNS: 'common',
        ns: ['common', 'booking', 'tour_section', 'footer'],
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
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        }
    });

export default i18n; 