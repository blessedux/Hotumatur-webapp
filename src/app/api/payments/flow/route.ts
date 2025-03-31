import { NextResponse } from 'next/server';
import { flowService } from '@/services/server/flow.service';
import { wooCommerceService } from '@/services/server/woocommerce.service';
import { config } from '@/config';

// Test endpoint for debugging Flow payment issues
export async function GET(request: Request) {
    try {
        console.log('[Flow API] Testing Flow payment with fixed values');

        // Using fixed values for testing
        const testPayment = await flowService.createPayment({
            amount: 1000, // Fixed amount: 1000 CLP
            email: "test@example.com",
            commerceOrder: `test-${Date.now()}`, // Unique order ID
            subject: `Test Payment`,
            urlConfirmation: `${config.app.appUrl}/api/payments/flow/confirm`,
            urlReturn: `${config.app.appUrl}/api/payments/flow/return`,
            paymentMethod: 9  // All payment methods
        });

        console.log('[Flow API] Test payment created successfully:', testPayment);

        return NextResponse.json({
            success: true,
            paymentUrl: testPayment.url,
            token: testPayment.token,
            flowOrder: testPayment.flowOrder,
            message: 'This is a test payment with fixed values'
        });
    } catch (error: unknown) {
        console.error('[Flow API] Error creating test payment:', error);

        // Extract detailed error information
        let errorMessage = 'Unknown error';
        let errorDetails = null;

        if (error instanceof Error) {
            errorMessage = error.message;

            const axiosError = error as any;
            if (axiosError.response) {
                errorDetails = {
                    status: axiosError.response.status,
                    statusText: axiosError.response.statusText,
                    data: axiosError.response.data
                };
            }
        }

        console.error('[Flow API] Detailed error:', errorMessage, errorDetails);

        return NextResponse.json(
            {
                error: 'Error creating test payment',
                message: errorMessage,
                details: errorDetails
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        let requestBody;
        try {
            requestBody = await request.json();
        } catch (e) {
            console.error('[Flow API] Failed to parse request body:', e);
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        const { orderId } = requestBody;

        if (!orderId) {
            console.error('[Flow API] Missing orderId in request');
            return NextResponse.json(
                { error: 'Missing orderId in request' },
                { status: 400 }
            );
        }

        console.log('[Flow API] Processing payment for order:', orderId);

        // Get order from WooCommerce
        let order;
        try {
            order = await wooCommerceService.getOrder(orderId);
            console.log('[Flow API] Order retrieved successfully:', {
                orderId,
                total: order.total,
                email: order.billing?.email ? `${order.billing.email.split('@')[0]}@***` : 'no email' // Mask email for logs
            });
        } catch (e) {
            console.error('[Flow API] Failed to retrieve order:', e);
            return NextResponse.json(
                { error: 'Failed to retrieve order', details: (e as Error).message },
                { status: 500 }
            );
        }

        // Validate order data
        if (!order.total) {
            console.error('[Flow API] Order has no total:', order);
            return NextResponse.json(
                { error: 'Order has no total' },
                { status: 400 }
            );
        }

        if (!order.billing || !order.billing.email) {
            console.error('[Flow API] Order has no billing email:', order);
            return NextResponse.json(
                { error: 'Order has no billing email' },
                { status: 400 }
            );
        }

        // Create Flow payment
        let payment;
        try {
            payment = await flowService.createPayment({
                amount: parseInt(order.total),
                email: order.billing.email,
                commerceOrder: `${orderId}`,
                subject: `Pago Orden #${orderId} en Hotumatur`,
                urlConfirmation: `${config.app.appUrl}/api/payments/flow/confirm`,
                urlReturn: `${config.app.appUrl}/api/payments/flow/return`,
                paymentMethod: 9  // All payment methods
            });

            console.log('[Flow API] Payment created successfully:', payment);
        } catch (e) {
            console.error('[Flow API] Failed to create payment:', e);
            return NextResponse.json(
                { error: 'Failed to create payment', details: (e as Error).message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            paymentUrl: payment.url,
            token: payment.token,
            flowOrder: payment.flowOrder
        });
    } catch (error: unknown) {
        console.error('[Flow API] Unexpected error:', error);

        // Extract detailed error information
        let errorMessage = 'Unknown error';
        let errorDetails = null;

        if (error instanceof Error) {
            errorMessage = error.message;

            const axiosError = error as any;
            if (axiosError.response) {
                errorDetails = {
                    status: axiosError.response.status,
                    statusText: axiosError.response.statusText,
                    data: axiosError.response.data
                };
            }
        }

        console.error('[Flow API] Detailed error:', errorMessage, errorDetails);

        return NextResponse.json(
            {
                error: 'Error processing payment',
                message: errorMessage,
                details: errorDetails
            },
            { status: 500 }
        );
    }
}


