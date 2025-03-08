// src/app/api/translate/route.ts
import { NextResponse } from 'next/server';
import { translateText, translateHtml, translateProduct } from '@/services/translation.service';

// Rate limiting
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const requestCounts: Record<string, number[]> = {};

function isRateLimited(ip: string): boolean {
    const now = Date.now();

    // Initialize or clean up old requests
    if (!requestCounts[ip]) {
        requestCounts[ip] = [];
    }

    // Remove requests older than the rate limit window
    requestCounts[ip] = requestCounts[ip].filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    // Check if the rate limit is exceeded
    if (requestCounts[ip].length >= RATE_LIMIT) {
        return true;
    }

    // Add the current request
    requestCounts[ip].push(now);
    return false;
}

export async function POST(request: Request) {
    try {
        // Get client IP for rate limiting
        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        // Check rate limit
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { text, html, product, targetLang = 'en', sourceLang = 'es', type = 'text' } = body;

        console.log(`Translation request type: ${type}, from ${sourceLang} to ${targetLang}`);

        let result;

        if (type === 'text' && text) {
            console.log('Translating text:', text.substring(0, 30) + (text.length > 30 ? '...' : ''));
            result = await translateText(text, targetLang, sourceLang);
        } else if (type === 'html' && html) {
            console.log('Translating HTML content');
            result = await translateHtml(html, targetLang, sourceLang);
        } else if (type === 'product' && product) {
            console.log('Translating product:', product.name);
            result = await translateProduct(product, targetLang, sourceLang);
        } else {
            console.error('Invalid translation request:', { type, hasText: !!text, hasHtml: !!html, hasProduct: !!product });
            return NextResponse.json(
                { error: 'Invalid request. Specify text, html, or product to translate.' },
                { status: 400 }
            );
        }

        console.log('Translation completed successfully');
        return NextResponse.json({ result });
    } catch (error) {
        console.error('Translation API error:', error);
        return NextResponse.json(
            { error: 'Failed to translate content', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}