// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/config';

// Define types for translations and meta data
interface MetaData {
    id: number;
    key: string;
    value: string;
}

interface Translations {
    [key: string]: string;
}

interface Attribute {
    id: number;
    name: string;
    slug: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
}

// Fields that should be translated
const TRANSLATABLE_FIELDS = [
    'name',
    'description',
    'short_description',
    'subtitulo',
    'meta_title',
    'meta_description'
];

// Attribute names that should be translated
const TRANSLATABLE_ATTRIBUTES = [
    'duracion',
    'dificultad',
    'incluye',
    'no incluye'
];

export async function GET(request: NextRequest) {
    try {
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        const lang = searchParams.get('lang') || 'es'; // Default to Spanish
        const category = searchParams.get('category');
        const limit = searchParams.get('limit') || '100';

        console.log(`[API] Request - Products: slug=${slug}, lang=${lang}, category=${category}, limit=${limit}`);

        // Create auth header
        const auth = Buffer.from(`${config.woocommerce.consumerKey}:${config.woocommerce.consumerSecret}`).toString('base64');

        // Build the API URL
        let apiUrl = `${config.woocommerce.url}/wp-json/wc/v3/products`;
        const params = new URLSearchParams();

        // Add parameters
        params.append('per_page', limit);

        if (slug) {
            params.append('slug', slug);
        }

        if (category) {
            params.append('category', category);
        }

        // Add language parameter if not Spanish
        if (lang && lang !== 'es') {
            params.append('lang', lang);
        }

        // Append parameters to URL
        apiUrl += `?${params.toString()}`;

        console.log(`[API] Fetching from WooCommerce: ${apiUrl}`);

        // Fetch products from WooCommerce with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            console.log(`[API] Received response with status: ${response.status}`);

            // Handle error responses
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[API] WooCommerce API error (${response.status}): ${errorText}`);
                return NextResponse.json(
                    { error: `Failed to fetch products: ${response.status}` },
                    { status: response.status }
                );
            }

            // Parse response
            const responseText = await response.text();
            console.log(`[API] Response text length: ${responseText.length}`);

            let products;
            try {
                products = JSON.parse(responseText);
            } catch (parseError) {
                console.error('[API] Error parsing JSON response:', parseError);
                console.error('[API] Response text preview:', responseText.substring(0, 200));
                return NextResponse.json(
                    { error: 'Invalid JSON response from WooCommerce API' },
                    { status: 500 }
                );
            }

            // Validate response
            if (!Array.isArray(products)) {
                console.error('[API] Invalid response format from WooCommerce API:', products);
                return NextResponse.json(
                    { error: 'Invalid response format from WooCommerce API' },
                    { status: 500 }
                );
            }

            // Process products
            console.log(`[API] Processing ${products.length} products`);

            // Process products with comprehensive translation handling
            const processedProducts = products.map(product => {
                // Get translations from meta_data if available
                const translations: Translations = {};

                if (product.meta_data && Array.isArray(product.meta_data)) {
                    product.meta_data.forEach((meta: MetaData) => {
                        // Check for translation fields with various formats
                        // Format 1: field_en (e.g., name_en)
                        if (meta.key && meta.key.endsWith('_en')) {
                            const field = meta.key.replace('_en', '');
                            translations[field] = meta.value;
                        }
                        // Format 2: field:en (e.g., name:en)
                        else if (meta.key && meta.key.endsWith(':en')) {
                            const field = meta.key.replace(':en', '');
                            translations[field] = meta.value;
                        }
                        // Format 3: field-en (e.g., name-en)
                        else if (meta.key && meta.key.endsWith('-en')) {
                            const field = meta.key.replace('-en', '');
                            translations[field] = meta.value;
                        }
                        // Format 4: en_field (e.g., en_name)
                        else if (meta.key && meta.key.startsWith('en_')) {
                            const field = meta.key.replace('en_', '');
                            translations[field] = meta.value;
                        }
                        // Format 5: attribute_name_en (e.g., attribute_duracion_en)
                        else if (meta.key && meta.key.startsWith('attribute_') && meta.key.endsWith('_en')) {
                            const attrName = meta.key.replace('attribute_', '').replace('_en', '');
                            translations[`attribute_${attrName}`] = meta.value;
                        }
                    });
                }

                // Apply translations if language is English
                let processedProduct = { ...product };

                if (lang === 'en') {
                    // Apply translations for all translatable fields
                    TRANSLATABLE_FIELDS.forEach(field => {
                        if (translations[field]) {
                            processedProduct[field] = translations[field];
                        }
                    });

                    // Apply translations for attributes
                    if (processedProduct.attributes && Array.isArray(processedProduct.attributes)) {
                        processedProduct.attributes = processedProduct.attributes.map((attr: Attribute) => {
                            // Check if this attribute should be translated
                            if (TRANSLATABLE_ATTRIBUTES.includes(attr.name.toLowerCase())) {
                                // Try to find translation for attribute name
                                const attrNameKey = `attribute_${attr.name}`;
                                if (translations[attrNameKey]) {
                                    attr = {
                                        ...attr,
                                        name: translations[attrNameKey]
                                    };
                                }

                                // Try to translate options
                                if (attr.options && Array.isArray(attr.options)) {
                                    attr.options = attr.options.map(option => {
                                        // Try to find translation for this option
                                        const optionKey = `${attr.name}_option_${option}`;
                                        if (translations[optionKey]) {
                                            return translations[optionKey];
                                        }
                                        return option;
                                    });
                                }
                            }
                            return attr;
                        });
                    }
                }

                return {
                    ...processedProduct,
                    // Add translation metadata
                    _translations: {
                        available: Object.keys(translations),
                        language: lang,
                        source: Object.keys(translations).length > 0 ? 'meta_data' : 'none'
                    },
                    // Add debug info
                    _debug: {
                        fetchedAt: new Date().toISOString(),
                        language: lang,
                        fromApi: true
                    }
                };
            });

            console.log(`[API] Returning ${processedProducts.length} products`);

            // Return processed products
            return NextResponse.json(processedProducts);
        } catch (error) {
            clearTimeout(timeoutId);

            // Handle timeout specifically
            if (error instanceof DOMException && error.name === 'AbortError') {
                console.error('[API] WooCommerce API request timed out');
                return NextResponse.json(
                    { error: 'Request to WooCommerce API timed out' },
                    { status: 504 }
                );
            }

            // Re-throw for general error handling
            throw error;
        }
    } catch (error) {
        console.error('[API] Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products', detail: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}