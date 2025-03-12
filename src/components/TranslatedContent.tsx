'use client';

import { useEffect, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';

// Direct translations for common terms
const DIRECT_TRANSLATIONS: Record<string, Record<string, string>> = {
    // Tour attributes
    "Duración": {
        en: "Duration",
        es: "Duración"
    },
    "Dificultad": {
        en: "Difficulty",
        es: "Dificultad"
    },
    "Incluye": {
        en: "Includes",
        es: "Incluye"
    },
    "No Incluye": {
        en: "Not Included",
        es: "No Incluye"
    },
    // Difficulty levels
    "Fácil": {
        en: "Easy",
        es: "Fácil"
    },
    "Moderado": {
        en: "Moderate",
        es: "Moderado"
    },
    "Difícil": {
        en: "Difficult",
        es: "Difícil"
    },
    // Common terms
    "horas": {
        en: "hours",
        es: "horas"
    },
    "minutos": {
        en: "minutes",
        es: "minutos"
    },
    "Transporte": {
        en: "Transportation",
        es: "Transporte"
    },
    "Guía turístico": {
        en: "Tour guide",
        es: "Guía turístico"
    },
    "Entrada al parque": {
        en: "Park entrance fee",
        es: "Entrada al parque"
    },
    "Agua": {
        en: "Water",
        es: "Agua"
    },
    "Snacks": {
        en: "Snacks",
        es: "Snacks"
    },
    "Almuerzo": {
        en: "Lunch",
        es: "Almuerzo"
    },
    "Propinas": {
        en: "Tips",
        es: "Propinas"
    },
    "Seguro de viaje": {
        en: "Travel insurance",
        es: "Seguro de viaje"
    },
    // New translations
    'Reservar ahora': { 'en': 'Book now' },
    'Ver más': { 'en': 'See more' },
    'Ver menos': { 'en': 'See less' },
    'Detalles': { 'en': 'Details' },
    'Itinerario': { 'en': 'Itinerary' },
    'Reseñas': { 'en': 'Reviews' },
    'Preguntas frecuentes': { 'en': 'FAQ' },
    'Agregar al carrito': { 'en': 'Add to cart' },
    'Adultos': { 'en': 'Adults' },
    'Niños': { 'en': 'Children' },
    'Fecha': { 'en': 'Date' },
    'Hora': { 'en': 'Time' },
    'Precio': { 'en': 'Price' },
    'Total': { 'en': 'Total' },
    'Continuar': { 'en': 'Continue' },
    'Volver': { 'en': 'Back' },
    'Pagar': { 'en': 'Pay' },
    'Cancelar': { 'en': 'Cancel' },
    'Confirmar': { 'en': 'Confirm' },
};

// Translation cache
const translationCache: Record<string, Record<string, string>> = {};

// Load cache from localStorage
if (typeof window !== 'undefined') {
    try {
        const cache = localStorage.getItem('htmlTranslationCache');
        if (cache) {
            Object.assign(translationCache, JSON.parse(cache));
        }
    } catch (error) {
        console.error('Error loading translation cache:', error);
    }
}

// Save cache to localStorage
function saveCache() {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('htmlTranslationCache', JSON.stringify(translationCache));
        } catch (error) {
            console.error('Error saving translation cache:', error);
        }
    }
}

interface TranslatedContentProps {
    html: string;
    className?: string;
}

function TranslatedContent({ html, className = '' }: TranslatedContentProps) {
    const { i18n } = useTranslation();
    const [translatedHtml, setTranslatedHtml] = useState(html);

    useEffect(() => {
        // If language is Spanish, just use the original HTML
        if (i18n.language === 'es') {
            setTranslatedHtml(html);
            return;
        }

        // For English, translate the HTML
        try {
            const translated = translateHtml(html, i18n.language);
            setTranslatedHtml(translated);
        } catch (error) {
            console.error('Error translating HTML:', error);
            setTranslatedHtml(html); // Fallback to original HTML
        }
    }, [html, i18n.language]);

    // Sanitize the HTML to prevent XSS attacks
    const sanitizedHtml = DOMPurify.sanitize(translatedHtml);

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
    );
}

// Function to translate HTML content
function translateHtml(html: string, language: string): string {
    if (!html || language === 'es') return html;

    try {
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Process all text nodes
        processNode(tempDiv, language);

        return tempDiv.innerHTML;
    } catch (error) {
        console.error('Error translating HTML:', error);
        return html;
    }
}

// Process nodes recursively
function processNode(node: Node, language: string) {
    // Skip script and style tags
    if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE') {
        return;
    }

    // If it's a text node, translate its content
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        const text = node.textContent.trim();
        if (text) {
            node.textContent = translateText(text, language);
        }
    }

    // Special handling for links to preserve URLs
    if (node.nodeName === 'A' && node instanceof HTMLAnchorElement) {
        // Don't modify href attributes
        const linkText = node.textContent?.trim();
        if (linkText && !linkText.startsWith('http') && !linkText.includes('@')) {
            node.textContent = translateText(linkText, language);
        }
    }

    // Process child nodes recursively
    const childNodes = Array.from(node.childNodes);
    childNodes.forEach(child => processNode(child, language));
}

// Function to translate text
function translateText(text: string, language: string): string {
    if (!text || language === 'es') return text;

    // Skip URLs and email addresses
    if (text.startsWith('http') || text.includes('@') || text.match(/^[\/\.]/) || text.match(/\.(com|org|net|io)/)) {
        return text;
    }

    // Check for direct translations
    if (DIRECT_TRANSLATIONS[text] && DIRECT_TRANSLATIONS[text][language]) {
        return DIRECT_TRANSLATIONS[text][language];
    }

    // Check for partial matches
    for (const key in DIRECT_TRANSLATIONS) {
        if (text.includes(key)) {
            return text.replace(key, DIRECT_TRANSLATIONS[key][language]);
        }
    }

    // Split text into words and translate each word
    const words = text.split(/\s+/);
    const translatedWords = words.map(word => {
        // Skip words that look like URLs or parts of URLs
        if (word.startsWith('http') || word.includes('@') || word.match(/\.(com|org|net|io)/)) {
            return word;
        }

        // Check if this word has a direct translation
        if (DIRECT_TRANSLATIONS[word] && DIRECT_TRANSLATIONS[word][language]) {
            return DIRECT_TRANSLATIONS[word][language];
        }
        return word;
    });

    return translatedWords.join(' ');
}

// Memoize the component to prevent unnecessary re-renders
export default memo(TranslatedContent); 