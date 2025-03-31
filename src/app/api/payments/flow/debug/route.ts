import { NextResponse } from 'next/server';
import { flowService } from '@/services/server/flow.service';
import { config } from '@/config';

export async function GET(request: Request) {
    try {
        console.log('[Debug] Starting Flow payment debug tests');

        // Log environment configuration
        console.log('[Debug] Environment:', {
            appUrl: config.app.appUrl,
            flowApiUrl: config.flow.apiUrl,
            hasFlowApiKey: !!config.flow.apiKey,
            hasFlowSecretKey: !!config.flow.secretKey
        });

        // Test case 1: Minimal payment
        console.log('\n[Debug] Test Case 1: Minimal payment');
        const minimalPayment = await flowService.createPayment({
            amount: 1000,
            email: "test@example.com",
            commerceOrder: `debug-${Date.now()}-1`,
            subject: "Debug Test Payment 1",
            urlConfirmation: `${config.app.appUrl}/api/payments/flow/confirm`,
            urlReturn: `${config.app.appUrl}/api/payments/flow/return`,
            paymentMethod: 1
        });

        // Test case 2: Payment with larger amount
        console.log('\n[Debug] Test Case 2: Larger payment');
        const largerPayment = await flowService.createPayment({
            amount: 50000,
            email: "test@example.com",
            commerceOrder: `debug-${Date.now()}-2`,
            subject: "Debug Test Payment 2",
            urlConfirmation: `${config.app.appUrl}/api/payments/flow/confirm`,
            urlReturn: `${config.app.appUrl}/api/payments/flow/return`,
            paymentMethod: 1
        });

        return NextResponse.json({
            success: true,
            tests: {
                minimalPayment: {
                    success: true,
                    url: minimalPayment.url,
                    token: minimalPayment.token,
                    flowOrder: minimalPayment.flowOrder
                },
                largerPayment: {
                    success: true,
                    url: largerPayment.url,
                    token: largerPayment.token,
                    flowOrder: largerPayment.flowOrder
                }
            },
            message: 'Debug tests completed successfully'
        });
    } catch (error: any) {
        console.error('[Debug] Error during debug tests:', error);

        return NextResponse.json({
            error: 'Debug tests failed',
            details: {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            }
        }, { status: 500 });
    }
} 