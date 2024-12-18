import { NextResponse } from 'next/server';
import { wooCommerceService } from '@/services/server/woocommerce.service';
import { ApiError } from '@/types/error';

export async function POST(request: Request) {
    try {
        const orderData = await request.json();
        const order = await wooCommerceService.createOrder(orderData);
        return NextResponse.json({
            success: true,
            order
        });
    } catch (error) {
        const apiError = error as ApiError;
        console.error('Error creating order:', apiError.response?.data || apiError.message);
        return NextResponse.json(
            {
                error: 'Failed to create order',
                details: apiError.response?.data || apiError.message
            },
            { status: 500 }
        );
    }
}