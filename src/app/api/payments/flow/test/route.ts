import { NextResponse } from 'next/server';
import { flowService } from '@/services/server/flow.service';
import { config } from '@/config';

export async function GET() {
    try {
        console.log('[Test] Creating test Flow payment');

        // Create a test payment with fixed values
        const payment = await flowService.createPayment({
            amount: 1000, // 1000 CLP
            email: "test@example.com",
            commerceOrder: `test-${Date.now()}`,
            subject: "Test Payment",
            urlConfirmation: `${config.app.appUrl}/api/payments/flow/confirm`,
            urlReturn: `${config.app.appUrl}/api/payments/flow/return`,
            paymentMethod: 1 // WebPay
        });

        console.log('[Test] Flow payment created:', payment);

        return NextResponse.json({
            success: true,
            payment,
            message: 'Test payment created successfully'
        });
    } catch (error: any) {
        console.error('[Test] Error creating test payment:', error);

        // Extract error details
        const errorDetails = {
            message: error.message,
            response: error.response ? {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            } : undefined
        };

        return NextResponse.json({
            error: 'Failed to create test payment',
            details: errorDetails
        }, { status: 500 });
    }
} 