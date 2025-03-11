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

// Initialize i18n
i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
        resources,
        debug: false, // Set to false to avoid unnecessary console logs
        fallbackLng: 'es',
        supportedLngs: ['es', 'en'],
        defaultNS: 'common',
        fallbackNS: 'common',
        ns: ['common', 'booking', 'tour_section', 'footer'],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['htmlTag', 'localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },
        react: {
            useSuspense: false,
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        }
    });

// Force initial language to match HTML lang attribute to avoid hydration mismatch
if (typeof document !== 'undefined') {
    const htmlLang = document.documentElement.lang || 'es';
    if (i18n.language !== htmlLang) {
        i18n.changeLanguage(htmlLang);
    }
}

export default i18n; 