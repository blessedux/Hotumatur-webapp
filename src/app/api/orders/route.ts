import { NextResponse } from 'next/server';
import { wooCommerceService } from '@/services/server/woocommerce.service';

interface OrderRequest {
    customer: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        country: string;
    };
    line_items: Array<{
        product_id: number;
        quantity: number;
        meta_data: Array<{
            key: string;
            value: string;
        }>;
    }>;
    meta_data?: Array<{
        key: string;
        value: string;
    }>;
}

interface ApiError {
    response?: {
        data: unknown;
    };
    message: string;
}

export async function POST(request: Request) {
    try {
        const orderData: OrderRequest = await request.json();

        // Validar los datos recibidos
        if (!orderData.customer || !orderData.line_items) {
            return NextResponse.json(
                { error: 'Invalid order data' },
                { status: 400 }
            );
        }

        // Pasar todos los datos al servicio de WooCommerce
        const order = await wooCommerceService.createOrder(orderData);

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                status: order.status,
                total: order.total
            }
        });
    } catch (error: unknown) {
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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('id');

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            );
        }

        const order = await wooCommerceService.getOrder(Number(orderId));
        return NextResponse.json({
            success: true,
            order
        });
    } catch (error: unknown) {
        const apiError = error as ApiError;
        return NextResponse.json(
            {
                error: 'Failed to fetch order',
                details: apiError.response?.data || apiError.message
            },
            { status: 500 }
        );
    }
} 