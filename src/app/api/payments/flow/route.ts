import { NextResponse } from 'next/server';
import { flowService } from '@/services/server/flow.service';
import { wooCommerceService } from '@/services/server/woocommerce.service';
import { config } from '@/config';

// Test endpoint for debugging Flow payment issues
export async function GET(request: Request) {
    try {
        console.log('Testing Flow payment with fixed values');

        // Using fixed values for testing
        const testPayment = await flowService.createPayment({
            amount: 1000, // Fixed amount: 1000 CLP
            email: "test@example.com",
            commerceOrder: `test-${Date.now()}`, // Unique order ID
            subject: `Test Payment`,
            urlConfirmation: `${config.app.appUrl}/api/payments/flow/confirm`,
            urlReturn: `${config.app.appUrl}/api/payments/flow/return`,
            paymentMethod: 1  // WebPay
        });

        console.log('Test Flow payment created successfully:', testPayment);

        return NextResponse.json({
            success: true,
            paymentUrl: testPayment.url,
            token: testPayment.token,
            flowOrder: testPayment.flowOrder,
            message: 'This is a test payment with fixed values'
        });
    } catch (error: unknown) {
        const err = error as import('axios').AxiosError;
        console.error('Error creating test payment:', err);

        // Extract detailed error information
        type ErrorDetails = {
            message: string;
            status?: number;
            statusText?: string;
            data?: any;
            headers?: string;
        };

        let errorDetails: ErrorDetails = {
            message: err.message
        };

        if (err.response) {
            errorDetails = {
                ...errorDetails,
                status: err.response.status,
                statusText: err.response.statusText,
                data: err.response.data,
                headers: JSON.stringify(err.response.headers)
            };
        }

        console.error('Detailed error:', JSON.stringify(errorDetails, null, 2));

        return NextResponse.json(
            {
                error: 'Error creating test payment',
                details: errorDetails
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { orderId } = await request.json();
        console.log('Processing Flow payment for order:', orderId);

        const order = await wooCommerceService.getOrder(orderId);
        console.log('Order retrieved successfully:', {
            orderId,
            total: order.total,
            email: order.billing.email
        });

        const payment = await flowService.createPayment({
            amount: parseInt(order.total),
            email: order.billing.email,
            commerceOrder: `${orderId}`,
            subject: `Pago Orden #${orderId} en Hotumatur`,
            urlConfirmation: `${config.app.appUrl}/api/payments/flow/confirm`,
            urlReturn: `${config.app.appUrl}/api/payments/flow/return`,
            // urlConfirmation: `https://b16adb4b6db6.ngrok.app/api/payments/flow/confirm`,
            // urlReturn: `https://b16adb4b6db6.ngrok.app/api/payments/flow/return`,
            paymentMethod: 1  // WebPay
        });

        console.log('Flow payment created successfully:', payment);

        return NextResponse.json({
            success: true,
            paymentUrl: payment.url,
            token: payment.token,
            flowOrder: payment.flowOrder
        });
    } catch (error: unknown) {
        const err = error as import('axios').AxiosError;
        console.error('Error creating payment:', err);

        // Extract detailed error information
        type ErrorDetails = {
            message: string;
            status?: number;
            statusText?: string;
            data?: any;
            headers?: string;
        };

        let errorDetails: ErrorDetails = {
            message: err.message
        };

        if (err.response) {
            errorDetails = {
                ...errorDetails,
                status: err.response.status,
                statusText: err.response.statusText,
                data: err.response.data,
                headers: JSON.stringify(err.response.headers)
            };
        }

        console.error('Detailed error:', JSON.stringify(errorDetails, null, 2));

        return NextResponse.json(
            {
                error: 'Error creating payment',
                details: errorDetails
            },
            { status: 500 }
        );
    }
}


