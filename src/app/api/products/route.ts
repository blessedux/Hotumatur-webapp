import { NextResponse } from 'next/server';
import { config } from '@/config';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        const wcAuth = Buffer.from(`${config.woocommerce.consumerKey}:${config.woocommerce.consumerSecret}`).toString('base64');

        const response = await fetch(
            `https://backend.hotumatur.com/wp-json/wc/v3/products${slug ? `?slug=${slug}` : ''}`,
            {
                headers: {
                    'Authorization': `Basic ${wcAuth}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`WooCommerce API error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Products API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}