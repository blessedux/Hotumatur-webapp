import { NextResponse } from 'next/server';
import { wooCommerceService } from '@/services/server/woocommerce.service';
import { AxiosError } from 'axios';

// Improved typing for Params
type Params = { orderId: string };

// Utility function to validate orderId
const validateOrderId = (orderId: string): number | null => {
    const id = parseInt(orderId, 10);
    return isNaN(id) || id <= 0 ? null : id;
};

// GET handler
export async function GET(request: Request, { params }: { params: Params }) {
    const { orderId } = params;

    // Validate orderId
    const validOrderId = validateOrderId(orderId);
    if (!validOrderId) {
        return NextResponse.json(
            { error: 'Invalid Order ID provided' },
            { status: 400 }
        );
    }

    try {
        // Fetch order from WooCommerce
        const order = await wooCommerceService.getOrder(validOrderId);

        return NextResponse.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        const apiError = error as AxiosError;

        return NextResponse.json(
            {
                error: 'Failed to fetch order',
                details: apiError.response?.data || apiError.message,
            },
            { status: apiError.response?.status || 500 }
        );
    }
}

// PUT handler
export async function PUT(request: Request, { params }: { params: Params }) {
    const { orderId } = params;

    // Validate orderId
    const validOrderId = validateOrderId(orderId);
    if (!validOrderId) {
        return NextResponse.json(
            { error: 'Invalid Order ID provided' },
            { status: 400 }
        );
    }

    try {
        // Parse update data from request
        const updateData = await request.json();

        // Validate updateData (basic example, customize as needed)
        if (!updateData || typeof updateData !== 'object') {
            return NextResponse.json(
                { error: 'Invalid data for order update' },
                { status: 400 }
            );
        }

        // Update order in WooCommerce
        const order = await wooCommerceService.updateOrder(validOrderId, updateData);

        return NextResponse.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error updating order:', error);
        const apiError = error as AxiosError;

        return NextResponse.json(
            {
                error: 'Failed to update order',
                details: apiError.response?.data || apiError.message,
            },
            { status: apiError.response?.status || 500 }
        );
    }
}