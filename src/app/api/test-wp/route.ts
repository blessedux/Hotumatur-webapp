import { NextResponse } from 'next/server';
import { config } from '@/config';

export async function GET() {
    try {
        // Test WordPress REST API
        const wpUrl = `${config.woocommerce.url}/wp-json`;
        console.log(`[Test] Checking WordPress REST API at: ${wpUrl}`);

        const response = await fetch(wpUrl);
        const data = await response.json();

        return NextResponse.json({
            success: true,
            data,
            message: 'WordPress REST API is accessible'
        });
    } catch (error) {
        console.error('[Test] Error checking WordPress REST API:', error);
        return NextResponse.json(
            {
                error: 'Failed to check WordPress REST API',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 