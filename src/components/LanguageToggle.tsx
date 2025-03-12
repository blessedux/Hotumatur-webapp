'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GB, ES } from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '@/i18n/config';

const LanguageToggle = () => {
    const [mounted, setMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isChanging, setIsChanging] = useState(false);
    const { i18n } = useTranslation();
    // Use state to force re-render when language changes
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    useEffect(() => {
        setMounted(true);

        const savedLang = localStorage.getItem('i18nextLng');
        const browserLang = navigator.language.split('-')[0];
        const defaultLang = (savedLang && ['es', 'en'].includes(savedLang)) ? savedLang :
            (['es', 'en'].includes(browserLang) ? browserLang : 'es');

        if (i18n.language !== defaultLang) {
            changeLanguage(defaultLang);
            setCurrentLanguage(defaultLang);
        }

        // Listen for language changes
        const handleLanguageChange = (lng: string) => {
            console.log(`Language changed in LanguageToggle to: ${lng}`);
            setCurrentLanguage(lng);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
            setMounted(false);
        };
    }, [i18n]);

    const handleLanguageChange = async (locale: string) => {
        if (i18n.language === locale || isChanging) return;

        try {
            console.log(`LanguageToggle: Changing language to ${locale}`);
            setIsChanging(true);

            // Change language
            changeLanguage(locale);

            // Close the language menu
            setIsExpanded(false);
        } catch (error) {
            console.error('Error changing language:', error);
        } finally {
            // Add a small delay to prevent rapid toggling
            setTimeout(() => setIsChanging(false), 500);
        }
    };

    const getCurrentFlag = () => {
        return currentLanguage === 'en' ? (
            <GB title="English" className="w-4 h-4" />
        ) : (
            <ES title="Español" className="w-4 h-4" />
        );
    };

    const button = (
        <div
            className="language-toggle-container"
            style={{
                position: 'fixed',
                top: '8rem',
                left: 0,
                zIndex: 99998,
                pointerEvents: 'none',
                isolation: 'isolate'
            }}
        >
            <div
                className={`
                    pointer-events-auto
                    backdrop-blur-md
                    bg-gray-800/30
                    transition-all
                    duration-300 ease-in-out
                    group
                    ${isExpanded ? 'w-32' : 'w-8'}
                    hover:w-32
                    focus-within:w-32
                    rounded-r-lg
                    overflow-hidden
                    ${isChanging ? 'opacity-70 cursor-wait' : ''}
                `}
                style={{
                    boxShadow: '2px 0 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderLeft: 'none'
                }}
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                onFocus={() => setIsExpanded(true)}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setIsExpanded(false);
                    }
                }}
            >
                <div className="flex items-center h-24 relative">
                    <div className="w-8 h-full flex flex-col justify-center items-center shrink-0">
                        {getCurrentFlag()}
                    </div>

                    <div className={`
                        flex flex-col
                        transition-all
                        duration-300
                        ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
                        group-hover:opacity-100
                        group-hover:translate-x-0
                        group-focus-within:opacity-100
                        group-focus-within:translate-x-0
                    `}>
                        <button
                            onClick={() => handleLanguageChange('es')}
                            className={`w-full py-2 px-3 text-left flex items-center space-x-2 hover:bg-white/10 transition-colors ${currentLanguage === 'es' ? 'text-emerald-300' : 'text-white'} ${isChanging ? 'cursor-wait' : ''}`}
                            disabled={isChanging}
                        >
                            <span className="text-sm">Español</span>
                        </button>
                        <button
                            onClick={() => handleLanguageChange('en')}
                            className={`w-full py-2 px-3 text-left flex items-center space-x-2 hover:bg-white/10 transition-colors ${currentLanguage === 'en' ? 'text-emerald-300' : 'text-white'} ${isChanging ? 'cursor-wait' : ''}`}
                            disabled={isChanging}
                        >
                            <span className="text-sm">English</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!mounted) return null;

    return createPortal(button, document.body);
};

export default LanguageToggle; 