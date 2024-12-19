import { NextResponse } from 'next/server';
import { wooCommerceService } from '@/services/server/woocommerce.service';
import { AxiosError } from 'axios';

type Params = Promise<{ orderId: string }>

export async function GET(
    request: Request,
    { params }: { params: Params }
) {
    const resolvedParams = await params;

    if (!resolvedParams?.orderId) {
        return NextResponse.json(
            { error: 'Order ID is required' },
            { status: 400 }
        );
    }

    try {
        const order = await wooCommerceService.getOrder(Number(resolvedParams.orderId));
        return NextResponse.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Params }
) {
    const resolvedParams = await params;

    if (!resolvedParams?.orderId) {
        return NextResponse.json(
            { error: 'Order ID is required' },
            { status: 400 }
        );
    }

    try {
        const updateData = await request.json();
        const order = await wooCommerceService.updateOrder(Number(resolvedParams.orderId), updateData);

        return NextResponse.json({
            success: true,
            order
        });
    } catch (error) {
        const apiError = error as AxiosError;
        console.error('Error updating order:', apiError.response?.data || apiError.message);
        return NextResponse.json(
            {
                error: 'Failed to update order',
                details: apiError.response?.data || apiError.message
            },
            { status: 500 }
        );
    }
}


