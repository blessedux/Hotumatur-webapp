import { NextResponse } from 'next/server';
import { config } from '@/config';

export async function POST(request: Request) {
    try {
        const { email, tourId, tourName, date, people } = await request.json();

        // Create the lead in WordPress using WooCommerce REST API
        const wcAuth = Buffer.from(`${config.woocommerce.consumerKey}:${config.woocommerce.consumerSecret}`).toString('base64');

        const response = await fetch(
            `https://backend.hotumatur.com/wp-json/wc/v3/leads`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${wcAuth}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    tour_id: tourId,
                    tour_name: tourName,
                    date,
                    people,
                    status: 'pending',
                    created_at: new Date().toISOString()
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to create lead: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating lead:', error);
        return NextResponse.json(
            { error: 'Failed to create lead' },
            { status: 500 }
        );
    }
} 