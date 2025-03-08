'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
    currentLanguage: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [currentLanguage, setCurrentLanguage] = useState<Language>('es');

    useEffect(() => {
        // Get initial language preference
        const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
        if (savedLanguage) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setCurrentLanguage(lang);
        localStorage.setItem('preferredLanguage', lang);
        // Here you can add additional logic for changing the language
        // such as updating API calls or reloading certain content
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
} 