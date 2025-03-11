'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [currentLang, setCurrentLang] = useState<string>('');
    const [isChanging, setIsChanging] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    // Initialize component after mount to avoid hydration issues
    useEffect(() => {
        setIsMounted(true);
        setCurrentLang(i18n.language || 'es');
    }, [i18n.language]);

    // Update current language state when i18n language changes
    useEffect(() => {
        if (isMounted && i18n.language) {
            setCurrentLang(i18n.language);
        }
    }, [i18n.language, isMounted]);

    const changeLanguage = async (lang: string) => {
        if (!isMounted || lang === currentLang || isChanging) return;

        try {
            setIsChanging(true);
            console.log(`Changing language to: ${lang}`);

            // Change i18n language
            await i18n.changeLanguage(lang);

            // Store language preference in localStorage
            localStorage.setItem('i18nextLng', lang);

            // Update HTML lang attribute
            document.documentElement.lang = lang;

            // Dispatch a custom event to notify components about language change
            window.dispatchEvent(new CustomEvent('language-changed', {
                detail: { language: lang }
            }));

            console.log(`Language changed to: ${lang}`);
        } catch (error) {
            console.error('Error changing language:', error);
        } finally {
            setIsChanging(false);
        }
    };

    // Don't render anything until mounted to avoid hydration issues
    if (!isMounted) {
        return null;
    }

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => changeLanguage('es')}
                className={`px-2 py-1 text-sm rounded-md transition-colors ${currentLang === 'es'
                    ? 'bg-primary text-white font-bold'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isChanging || currentLang === 'es'}
                aria-label="Switch to Spanish"
            >
                ES
            </button>
            <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 text-sm rounded-md transition-colors ${currentLang === 'en'
                    ? 'bg-primary text-white font-bold'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isChanging || currentLang === 'en'}
                aria-label="Switch to English"
            >
                EN
            </button>
        </div>
    );
} 