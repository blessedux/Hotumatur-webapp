import { NextResponse } from 'next/server';
import { wooCommerceService } from '@/services/server/woocommerce.service';

export async function GET(
    request: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const order = await wooCommerceService.getOrder(Number(params.orderId));
        return NextResponse.json({
            success: true,
            order
        });
    } catch (error: any) {
        console.error('Error fetching order:', error.response?.data || error.message);
        return NextResponse.json(
            {
                error: 'Failed to fetch order',
                details: error.response?.data || error.message
            },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const updateData = await request.json();
        const order = await wooCommerceService.updateOrder(Number(params.orderId), updateData);

        return NextResponse.json({
            success: true,
            order
        });
    } catch (error: any) {
        console.error('Error updating order:', error.response?.data || error.message);
        return NextResponse.json(
            {
                error: 'Failed to update order',
                details: error.response?.data || error.message
            },
            { status: 500 }
        );
    }
} 