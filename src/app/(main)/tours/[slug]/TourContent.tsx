'use client';

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { MdAccessTime } from "react-icons/md";
import { RiBatteryChargeLine } from "react-icons/ri";
import { CheckCircle } from 'lucide-react'
import { VscError } from "react-icons/vsc";
import SingleTourSelector from "@/components/SingleTourSelector";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Product } from "@/types/woocommerce";
import { getCachedProduct, startBackgroundSync } from "@/services/translationCache.service";
import TranslatedContent from '@/components/TranslatedContent';

// Add direct translations for content that isn't being translated properly
const DIRECT_TRANSLATIONS: Record<string, Record<string, string>> = {
    // Tour names
    "Tour de Isla Completo": {
        en: "Complete Island Tour",
        es: "Tour de Isla Completo"
    },
    "Amanecer en Tongariki": {
        en: "Sunrise at Tongariki",
        es: "Amanecer en Tongariki"
    },
    "Atardecer en Tahai": {
        en: "Sunset at Tahai",
        es: "Atardecer en Tahai"
    },
    "Tour Arqueológico": {
        en: "Archaeological Tour",
        es: "Tour Arqueológico"
    },
    "Tour de Anakena": {
        en: "Anakena Tour",
        es: "Tour de Anakena"
    },
    // Common attributes
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
    // Duration values
    "3 horas": {
        en: "3 hours",
        es: "3 horas"
    },
    "4 horas": {
        en: "4 hours",
        es: "4 horas"
    },
    "5 horas": {
        en: "5 hours",
        es: "5 horas"
    },
    "6 horas": {
        en: "6 hours",
        es: "6 horas"
    },
    "8 horas": {
        en: "8 hours",
        es: "8 horas"
    },
    // Common includes
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
    // Common not includes
    "Propinas": {
        en: "Tips",
        es: "Propinas"
    },
    "Seguro de viaje": {
        en: "Travel insurance",
        es: "Seguro de viaje"
    }
};

// Function to translate text directly
function directTranslate(text: string, language: string): string {
    if (!text) return '';

    // Check if we have a direct translation for this text
    if (DIRECT_TRANSLATIONS[text] && DIRECT_TRANSLATIONS[text][language]) {
        return DIRECT_TRANSLATIONS[text][language];
    }

    // Check if we have a direct translation for this text (case insensitive)
    const lowerText = text.toLowerCase();
    for (const key in DIRECT_TRANSLATIONS) {
        if (key.toLowerCase() === lowerText && DIRECT_TRANSLATIONS[key][language]) {
            return DIRECT_TRANSLATIONS[key][language];
        }
    }

    // Check if the text contains any of our translatable phrases
    for (const key in DIRECT_TRANSLATIONS) {
        if (text.includes(key) && DIRECT_TRANSLATIONS[key][language]) {
            return text.replace(key, DIRECT_TRANSLATIONS[key][language]);
        }
    }

    // If no translation found, return the original text
    return text;
}

// Function to translate HTML content
function translateHtml(html: string, language: string): string {
    if (!html || language === 'es') return html;

    try {
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Process all elements recursively
        processNode(tempDiv, language);

        return tempDiv.innerHTML;
    } catch (error) {
        console.error('Error translating HTML:', error);
        return html; // Return original HTML if there's an error
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
            // Translate the text content
            node.textContent = translateText(text, language);
        }
    }

    // Process child nodes recursively
    const childNodes = Array.from(node.childNodes);
    childNodes.forEach(child => processNode(child, language));
}

// Translate text content word by word or phrase by phrase
function translateText(text: string, language: string): string {
    if (!text || language === 'es') return text;

    // First check if we have a direct translation for the entire text
    const directTranslation = directTranslate(text, language);
    if (directTranslation !== text) {
        return directTranslation;
    }

    // Common Spanish words and their English translations
    const commonWords: Record<string, string> = {
        // Articles
        "el": "the", "la": "the", "los": "the", "las": "the", "un": "a", "una": "a", "unos": "some", "unas": "some",

        // Prepositions
        "de": "of", "en": "in", "con": "with", "por": "by", "para": "for", "sin": "without",
        "sobre": "on", "bajo": "under", "entre": "between", "hasta": "until", "desde": "from",

        // Conjunctions
        "y": "and", "o": "or", "pero": "but", "porque": "because", "si": "if", "cuando": "when",

        // Common verbs
        "es": "is", "son": "are", "está": "is", "están": "are", "fue": "was", "fueron": "were",
        "ha": "has", "han": "have", "había": "had", "habían": "had", "tendrá": "will have",
        "ver": "see", "visitar": "visit", "conocer": "know", "explorar": "explore", "disfrutar": "enjoy",

        // Common adjectives
        "grande": "big", "pequeño": "small", "hermoso": "beautiful", "bonito": "pretty",
        "increíble": "incredible", "impresionante": "impressive", "antiguo": "ancient",
        "histórico": "historical", "arqueológico": "archaeological", "cultural": "cultural",

        // Common nouns
        "isla": "island", "tour": "tour", "playa": "beach", "volcán": "volcano", "montaña": "mountain",
        "estatua": "statue", "moai": "moai", "océano": "ocean", "mar": "sea", "guía": "guide",
        "experiencia": "experience", "aventura": "adventure", "viaje": "journey", "camino": "path",
        "sitio": "site", "lugar": "place", "punto": "point", "vista": "view", "paisaje": "landscape",

        // Time-related
        "día": "day", "noche": "night", "mañana": "morning", "tarde": "afternoon",
        "hora": "hour", "minuto": "minute", "amanecer": "sunrise", "atardecer": "sunset",

        // Tourism-related
        "turista": "tourist", "visitante": "visitor", "grupo": "group", "fotografía": "photography",
        "cámara": "camera", "recuerdo": "souvenir", "historia": "history", "cultura": "culture",
        "tradición": "tradition", "nativo": "native", "local": "local", "transporte": "transportation",

        // Easter Island specific
        "Rapa Nui": "Easter Island", "Hanga Roa": "Hanga Roa", "Tongariki": "Tongariki",
        "Anakena": "Anakena", "Tahai": "Tahai", "Rano Kau": "Rano Kau", "Rano Raraku": "Rano Raraku",
        "Orongo": "Orongo", "Ahu": "Ahu", "Puna Pau": "Puna Pau", "Vinapu": "Vinapu",

        // Numbers
        "uno": "one", "dos": "two", "tres": "three", "cuatro": "four", "cinco": "five",
        "seis": "six", "siete": "seven", "ocho": "eight", "nueve": "nine", "diez": "ten",
        "primero": "first", "segundo": "second", "tercero": "third", "último": "last"
    };

    // Split the text into words and translate each word
    const words = text.split(/(\s+)/); // Split by whitespace but keep the separators

    return words.map(word => {
        // Skip empty words and whitespace
        if (!word.trim()) return word;

        // Check for punctuation
        const punctuationPrefix = word.match(/^[.,;:!?¡¿()"']+/)?.[0] || '';
        const punctuationSuffix = word.match(/[.,;:!?¡¿()"']+$/)?.[0] || '';

        // Remove punctuation for translation
        const cleanWord = word
            .substring(punctuationPrefix.length)
            .substring(0, word.length - punctuationPrefix.length - punctuationSuffix.length);

        // Skip translation if the word is empty after removing punctuation
        if (!cleanWord) return word;

        // Check if we have a direct translation for this word
        let translatedWord = directTranslate(cleanWord, language);

        // If no direct translation, check common words dictionary
        if (translatedWord === cleanWord) {
            const lowerWord = cleanWord.toLowerCase();
            translatedWord = commonWords[lowerWord] || cleanWord;

            // Preserve capitalization
            if (cleanWord[0] === cleanWord[0].toUpperCase()) {
                translatedWord = translatedWord.charAt(0).toUpperCase() + translatedWord.slice(1);
            }
        }

        // Reattach punctuation
        return punctuationPrefix + translatedWord + punctuationSuffix;
    }).join('');
}

interface ProductWithAttributes extends Product {
    subtitulo?: string;
    name_en?: string;
    productAttributes: {
        name: string;
        value: string;
        value_en: string;
    }[];
}

const iconConfig = {
    'duración': {
        icon: MdAccessTime,
        size: 'h-6 w-6',
        color: 'text-blue-500',
        translation: 'tour_section.duration'
    },
    'dificultad': {
        icon: RiBatteryChargeLine,
        size: 'h-6 w-6',
        color: 'text-green-500',
        translation: 'tour_section.difficulty'
    },
    'incluye': {
        icon: CheckCircle,
        size: 'h-6 w-6',
        color: 'text-emerald-500',
        translation: 'tour_section.includes'
    },
    'no incluye': {
        icon: VscError,
        size: 'h-6 w-6',
        color: 'text-red-500',
        translation: 'tour_section.notIncludes'
    }
} as const;

// English version of the icon config for when the language is English
const iconConfigEn = {
    'duration': {
        icon: MdAccessTime,
        size: 'h-6 w-6',
        color: 'text-blue-500',
        translation: 'tour_section.duration'
    },
    'difficulty': {
        icon: RiBatteryChargeLine,
        size: 'h-6 w-6',
        color: 'text-green-500',
        translation: 'tour_section.difficulty'
    },
    'includes': {
        icon: CheckCircle,
        size: 'h-6 w-6',
        color: 'text-emerald-500',
        translation: 'tour_section.includes'
    },
    'not included': {
        icon: VscError,
        size: 'h-6 w-6',
        color: 'text-red-500',
        translation: 'tour_section.notIncludes'
    }
} as const;

// Define the type for the icon config
type IconConfig = {
    icon: React.ElementType;
    size: string;
    color: string;
    translation: string;
};

interface TourContentProps {
    slug: string;
}

export default function TourContent({ slug }: TourContentProps) {
    const { t, i18n } = useTranslation(['common', 'tour_section']);
    const [product, setProduct] = useState<ProductWithAttributes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentLanguage = i18n.language;
    const [translationDebug, setTranslationDebug] = useState<any>(null);

    // Start background sync on component mount
    useEffect(() => {
        startBackgroundSync();
    }, []);

    // Force re-render when language changes
    useEffect(() => {
        // Log language change
        console.log('Language changed to:', currentLanguage);

        // Clear product state when language changes to force a clean re-render
        setProduct(null);
        setLoading(true);
    }, [currentLanguage]);

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                setError(null);

                console.log(`Fetching product with slug: ${slug}, language: ${currentLanguage}`);

                // Use the cached product service - this will return immediately if cached
                const productData = await getCachedProduct(slug, currentLanguage);

                if (!productData) {
                    throw new Error('Product not found');
                }

                console.log(`Got product data for ${slug} in ${currentLanguage}:`, productData.name);

                // Process the product data
                const processedProduct = {
                    ...productData,
                    productAttributes: productData.attributes.map((attr: any) => {
                        const name = attr.name.charAt(0).toUpperCase() + attr.name.slice(1);
                        const value = attr.options[0] || '';

                        return {
                            name,
                            value
                        };
                    }),
                    subtitulo: productData.meta_data?.find((meta: any) => meta.key === 'subtitulo')?.value || ''
                };

                // Store translation debug info
                setTranslationDebug({
                    language: currentLanguage,
                    productName: productData.name,
                    description: productData.description?.substring(0, 100) + '...',
                    shortDescription: productData.short_description?.substring(0, 100) + '...',
                    attributes: processedProduct.productAttributes,
                    translationMethod: currentLanguage !== 'es' ? 'Cached Translation' : 'Original'
                });

                // Log the processed product for debugging
                console.log('Processed product:', processedProduct);

                setProduct(processedProduct);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [slug, currentLanguage]);

    // Listen for translation updates
    useEffect(() => {
        const handleTranslationUpdate = (event: CustomEvent) => {
            const { slug: updatedSlug, language } = event.detail;
            if (updatedSlug === slug && language === currentLanguage) {
                console.log(`Translation updated for ${slug}, refreshing product`);
                // Refresh the product
                getCachedProduct(slug, currentLanguage)
                    .then(productData => {
                        if (!productData) return;

                        // Process the product data
                        const processedProduct = {
                            ...productData,
                            productAttributes: productData.attributes.map((attr: any) => {
                                const name = attr.name.charAt(0).toUpperCase() + attr.name.slice(1);
                                const value = attr.options[0] || '';

                                return {
                                    name,
                                    value
                                };
                            }),
                            subtitulo: productData.meta_data?.find((meta: any) => meta.key === 'subtitulo')?.value || ''
                        };

                        setProduct(processedProduct);
                    })
                    .catch(error => {
                        console.error('Error refreshing product:', error);
                    });
            }
        };

        window.addEventListener('translation-updated', handleTranslationUpdate as EventListener);

        return () => {
            window.removeEventListener('translation-updated', handleTranslationUpdate as EventListener);
        };
    }, [slug, currentLanguage]);

    if (loading) return (
        <div className="min-h-screen pt-[120px] flex items-center justify-center">
            <p className="text-lg">{t('loading', { ns: 'common' })}</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen pt-[120px] flex items-center justify-center">
            <p className="text-lg text-red-500">{t('error', { ns: 'common' })}: {error}</p>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen pt-[120px] flex items-center justify-center">
            <p className="text-lg">{t('noProducts', { ns: 'common' })}</p>
        </div>
    );

    // Get the appropriate content based on language
    const isEnglish = currentLanguage === 'en';

    // Log the content being used for debugging
    console.log('Content being displayed:', {
        language: currentLanguage,
        name: product.name,
        description: product.description?.substring(0, 100) + '...'
    });

    // Debug component to show translation status (only visible in development)
    const DebugTranslations = process.env.NODE_ENV === 'development' ? () => (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs z-50 max-h-[80vh] overflow-auto">
            <h4 className="font-bold mb-2">Translation Debug</h4>
            <div className="space-y-1">
                <p>Language: <span className="font-mono">{currentLanguage}</span></p>
                <p>Name: <span className="text-green-400">{product.name}</span></p>
                <p>Description: <span className="text-green-400">✓</span></p>
                <p>Short Description: <span className="text-green-400">✓</span></p>
                <p>Translation Method: <span className="text-yellow-400">{translationDebug?.translationMethod || 'Unknown'}</span></p>

                <div className="mt-2">
                    <p className="font-bold">Attributes:</p>
                    <div className="text-xs max-h-20 overflow-y-auto bg-gray-800 p-1 rounded mt-1">
                        {product.productAttributes?.map((attr: any, index: number) => (
                            <div key={index} className="mb-1">
                                {attr.name}: {attr.value}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-2">
                    <p className="font-bold">Meta Data:</p>
                    <div className="text-xs max-h-20 overflow-y-auto bg-gray-800 p-1 rounded mt-1">
                        {product.meta_data?.map((meta: any, index: number) => (
                            <div key={index} className="mb-1">
                                {meta.key}: {typeof meta.value === 'string' ? meta.value.substring(0, 30) + '...' : '[non-string value]'}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    onClick={() => console.log('Full product data:', product)}
                >
                    Log Full Product Data
                </button>
            </div>
        </div>
    ) : () => null;

    return (
        <div className="min-h-screen">
            {/* Debug component */}
            <DebugTranslations />

            {/* Hero Section */}
            <div className="relative h-[80vh] w-full">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={product.images[0]?.src || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Top fade for navbar transition */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" style={{ opacity: 0.9 }} />
                    {/* Overall image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/50" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col mt-12 md:mt-20 justify-end">
                    <div className="container mx-auto px-4 pb-12 md:pb-20">
                        <div className="max-w-4xl">
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                {product.name}
                            </h1>
                            {product.subtitulo && (
                                <p className="text-xl text-white/90 mb-4">{product.subtitulo}</p>
                            )}
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-3xl font-bold text-white">
                                    ${parseInt(product.price).toLocaleString('es-CL')}
                                </span>
                                <span className="text-white/80">/{t('perPerson', { ns: 'common' })}</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                                <SingleTourSelector
                                    tourId={product.id}
                                    tourName={product.name}
                                    tourPrice={parseInt(product.price)}
                                    tourImage={product.images[0]?.src || "/placeholder.svg"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto py-12 px-4 max-w-[1200px]">
                {product.short_description && (
                    <div className="mb-8 text-xl text-gray-700 font-medium">
                        <TranslatedContent html={product.short_description} />
                    </div>
                )}

                <div
                    className="prose prose-lg max-w-none
                            prose-headings:font-bold prose-headings:text-gray-900
                            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-gray-600 prose-p:leading-relaxed
                            prose-ul:mt-4 prose-ul:list-disc prose-ul:pl-6
                            prose-li:text-gray-600 prose-li:mb-2
                            prose-strong:text-gray-900 prose-strong:font-semibold"
                >
                    <TranslatedContent html={product.description} />
                </div>
                <Card className="mt-10">
                    <CardContent className="p-10">
                        <h3 className="text-2xl font-bold mb-6">{t('title', { ns: 'tour_section' })}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {product.productAttributes.map((attr) => {
                                // Use the appropriate icon config based on language
                                const configs = isEnglish ? iconConfigEn : iconConfig;
                                const attrNameLower = attr.name.toLowerCase();

                                // Try to find the config in the current language
                                let config: IconConfig = (configs as any)[attrNameLower];

                                // If not found, use a default config
                                if (!config) {
                                    config = {
                                        icon: CheckCircle,
                                        size: 'h-5 w-5',
                                        color: 'text-gray-600',
                                        translation: attr.name
                                    };
                                }

                                const Icon = config.icon;

                                if (
                                    attrNameLower === 'incluye' ||
                                    attrNameLower === 'no incluye' ||
                                    attrNameLower === 'includes' ||
                                    attrNameLower === 'not included'
                                ) {
                                    const items = attr.value
                                        .split('•')
                                        .map(item => item.trim())
                                        .filter(item => item !== '');

                                    return (
                                        <div key={attr.name} className="space-y-2">
                                            <div className="flex items-center gap-2 font-semibold">
                                                <Icon className={`${config.size} ${config.color}`} />
                                                <span>{
                                                    typeof config.translation === 'string' && config.translation.includes('.')
                                                        ? t(config.translation.split('.')[1], { ns: 'tour_section' })
                                                        : attr.name
                                                }</span>
                                            </div>
                                            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-gray-600">
                                                {items.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                }

                                // Special handling for duration
                                if (attrNameLower === 'duración' || attrNameLower === 'duration') {
                                    // Extract numeric part and determine unit
                                    const numericPart = attr.value.match(/\d+/)?.[0] || '';
                                    const isHours = attr.value.toLowerCase().includes('hora') || attr.value.toLowerCase().includes('hour');
                                    const unit = isHours ? 'hours' : 'days';

                                    // Create translated value
                                    const translatedValue = `${numericPart} ${t(unit, { ns: 'tour_section' })}`;

                                    return (
                                        <div key={attr.name} className="flex items-center gap-2">
                                            <Icon className={`${config.size} ${config.color}`} />
                                            <span className="font-semibold">{
                                                typeof config.translation === 'string' && config.translation.includes('.')
                                                    ? t(config.translation.split('.')[1], { ns: 'tour_section' })
                                                    : attr.name
                                            }:</span>
                                            <span>{translatedValue}</span>
                                        </div>
                                    );
                                }

                                // For all other attributes
                                return (
                                    <div key={attr.name} className="flex items-center gap-2">
                                        <Icon className={`${config.size} ${config.color}`} />
                                        <span className="font-semibold">{
                                            typeof config.translation === 'string' && config.translation.includes('.')
                                                ? t(config.translation.split('.')[1], { ns: 'tour_section' })
                                                : attr.name
                                        }:</span>
                                        <span>{attr.value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 