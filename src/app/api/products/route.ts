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

// Mock data for development and testing
const mockProducts = [
    {
        id: 1001,
        name: "Rapa Nui Sunset Tour",
        slug: "rapa-nui-sunset-tour",
        permalink: "/tour/rapa-nui-sunset-tour",
        date_created: "2023-03-15T14:30:00",
        status: "publish",
        description: "Experience the magical sunset of Easter Island with our expert guides.",
        short_description: "Sunset tour of Rapa Nui",
        price: "75000",
        categories: [{ id: 1, name: "Tours", slug: "tours" }],
        images: [{ id: 101, src: "/images/placeholder-tour.jpg", alt: "Rapa Nui Sunset" }],
        attributes: [
            {
                id: 1,
                name: "duracion",
                position: 0,
                visible: true,
                variation: false,
                options: ["3 hours"]
            },
            {
                id: 2,
                name: "dificultad",
                position: 1,
                visible: true,
                variation: false,
                options: ["Easy"]
            }
        ],
        meta_data: []
    },
    {
        id: 1002,
        name: "Moai Archaeological Tour",
        slug: "moai-archaeological-tour",
        permalink: "/tour/moai-archaeological-tour",
        date_created: "2023-03-16T10:00:00",
        status: "publish",
        description: "Explore the ancient Moai statues with our archaeology experts.",
        short_description: "Archaeological tour of the Moai",
        price: "95000",
        categories: [{ id: 1, name: "Tours", slug: "tours" }],
        images: [{ id: 102, src: "/images/placeholder-tour-2.jpg", alt: "Moai statues" }],
        attributes: [
            {
                id: 1,
                name: "duracion",
                position: 0,
                visible: true,
                variation: false,
                options: ["6 hours"]
            },
            {
                id: 2,
                name: "dificultad",
                position: 1,
                visible: true,
                variation: false,
                options: ["Moderate"]
            }
        ],
        meta_data: []
    },
    {
        id: 1003,
        name: "Island Cultural Experience",
        slug: "island-cultural-experience",
        permalink: "/tour/island-cultural-experience",
        date_created: "2023-03-17T09:15:00",
        status: "publish",
        description: "Immerse yourself in the rich cultural heritage of Rapa Nui.",
        short_description: "Cultural immersion tour",
        price: "85000",
        categories: [{ id: 1, name: "Tours", slug: "tours" }],
        images: [{ id: 103, src: "/images/placeholder-tour-3.jpg", alt: "Cultural experience" }],
        attributes: [
            {
                id: 1,
                name: "duracion",
                position: 0,
                visible: true,
                variation: false,
                options: ["4 hours"]
            },
            {
                id: 2,
                name: "dificultad",
                position: 1,
                visible: true,
                variation: false,
                options: ["Easy"]
            }
        ],
        meta_data: []
    }
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

        // Check for environment or use mock data for development
        if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
            console.log('[API] Using mock product data for development');

            // Filter mock products based on query parameters
            let filteredProducts = [...mockProducts];

            if (slug) {
                filteredProducts = filteredProducts.filter(p => p.slug === slug);
            }

            if (category) {
                filteredProducts = filteredProducts.filter(p =>
                    p.categories.some(c => c.id.toString() === category || c.slug === category)
                );
            }

            return NextResponse.json(filteredProducts);
        }

        // Create auth header
        const auth = Buffer.from(`${config.woocommerce.consumerKey}:${config.woocommerce.consumerSecret}`).toString('base64');

        // Build the API URL
        let apiUrl = `${config.woocommerce.url}/wp-json/wc/v3/products`;
        const params = new URLSearchParams();

        // Add parameters
        params.append('per_page', limit);

        if (slug) {
            // Ensure slug is properly encoded
            const encodedSlug = encodeURIComponent(slug);
            params.append('slug', encodedSlug);
            console.log(`[API] Using encoded slug: ${encodedSlug} (original: ${slug})`);
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
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        try {
            console.log(`[API] Making request to WooCommerce with URL: ${apiUrl}`);
            console.log(`[API] Using auth header: Basic ${auth.substring(0, 10)}...`);

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
                console.error(`[API] Request URL: ${apiUrl}`);
                console.error(`[API] Request headers:`, {
                    Authorization: 'Basic ***' + auth.substring(auth.length - 5),
                    'Content-Type': 'application/json',
                });

                // Try to get more information about the error
                try {
                    const errorJson = JSON.parse(errorText);
                    console.error(`[API] Parsed error response:`, errorJson);
                } catch (e) {
                    console.error(`[API] Could not parse error response as JSON:`, e);
                }

                // Fall back to mock data in development
                if (process.env.NODE_ENV === 'development') {
                    console.log('[API] Falling back to mock data due to API error');
                    return NextResponse.json(mockProducts);
                }

                return NextResponse.json(
                    {
                        error: `Failed to fetch products: ${response.status}`,
                        details: errorText,
                        url: apiUrl.replace(config.woocommerce.consumerSecret, '***')
                    },
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

                // Fall back to mock data in development
                if (process.env.NODE_ENV === 'development') {
                    console.log('[API] Falling back to mock data due to JSON parse error');
                    return NextResponse.json(mockProducts);
                }

                return NextResponse.json(
                    { error: 'Invalid JSON response from WooCommerce API' },
                    { status: 500 }
                );
            }

            // Validate response
            if (!Array.isArray(products)) {
                console.error('[API] Invalid response format from WooCommerce API:', products);

                // Fall back to mock data in development
                if (process.env.NODE_ENV === 'development') {
                    console.log('[API] Falling back to mock data due to non-array response');
                    return NextResponse.json(mockProducts);
                }

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

                // Fall back to mock data in development
                if (process.env.NODE_ENV === 'development') {
                    console.log('[API] Falling back to mock data due to timeout');
                    return NextResponse.json(mockProducts);
                }

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

        // Fall back to mock data in development
        if (process.env.NODE_ENV === 'development') {
            console.log('[API] Falling back to mock data due to general error');
            return NextResponse.json(mockProducts);
        }

        return NextResponse.json(
            { error: 'Failed to fetch products', detail: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}