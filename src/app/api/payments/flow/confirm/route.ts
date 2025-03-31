import { NextRequest, NextResponse } from 'next/server';
import { flowService } from '@/services/server/flow.service';
import { wooCommerceService } from '@/services/server/woocommerce.service';
import { config } from '@/config';

export async function POST(request: NextRequest) {
    try {
        console.log('[Flow Confirm] Processing payment confirmation');

        // Flow can send the token either as form data or as a query parameter
        let token;

        try {
            // First try to get token from form data
            const formData = await request.formData();
            token = formData.get('token')?.toString();
            console.log('[Flow Confirm] Token from form data:', token);
        } catch (error) {
            console.log('[Flow Confirm] Could not parse form data, trying query parameters');
            // If form data is not available, try query parameters
            const url = new URL(request.url);
            token = url.searchParams.get('token');
            console.log('[Flow Confirm] Token from query parameters:', token);
        }

        // If no token found in either form data or query params, check the request body as JSON
        if (!token) {
            try {
                const jsonData = await request.json();
                token = jsonData.token;
                console.log('[Flow Confirm] Token from JSON body:', token);
            } catch (error) {
                console.log('[Flow Confirm] Could not parse JSON body, no token found');
            }
        }

        if (!token) {
            console.error('[Flow Confirm] No token provided in confirmation request');
            return NextResponse.json({ message: 'Pago confirmado', details: 'No token provided' }, { status: 200 });
        }

        console.log('[Flow Confirm] Payment confirmation with token:', token);

        // Check if this is a mock token (starts with TEST_)
        if (token.startsWith('TEST_')) {
            console.log('[Flow Confirm] Mock payment detected, processing as successful');

            // For mock payments, simulate a successful payment confirmation
            // We still return 200 to Flow as confirmation received
            return NextResponse.json({
                message: 'Pago confirmado',
                success: true,
                token: token,
                mockPayment: true
            });
        }

        // For real tokens, get the payment status
        try {
            const paymentStatus = await flowService.getPaymentStatus(token);
            console.log('[Flow Confirm] Payment status:', paymentStatus);

            if (paymentStatus.status === 2) { // Status 2 is successful payment
                console.log('[Flow Confirm] Payment was successful');

                // Update the WooCommerce order if we have a commerceOrder
                if (paymentStatus.commerceOrder) {
                    try {
                        await wooCommerceService.updateOrder(
                            parseInt(paymentStatus.commerceOrder),
                            {
                                status: 'processing',
                                meta_data: [
                                    {
                                        key: 'flow_transaction_id',
                                        value: paymentStatus.flowOrder.toString()
                                    },
                                    {
                                        key: 'payment_method',
                                        value: 'Flow'
                                    }
                                ]
                            }
                        );
                        console.log('[Flow Confirm] Updated WooCommerce order status for:', paymentStatus.commerceOrder);
                    } catch (updateError) {
                        console.error('[Flow Confirm] Error updating WooCommerce order:', updateError);
                    }
                }
            } else {
                console.log('[Flow Confirm] Payment was not successful, status:', paymentStatus.status);
            }

            return NextResponse.json({
                message: 'Pago confirmado',
                status: paymentStatus.status,
                commerceOrder: paymentStatus.commerceOrder,
                flowOrder: paymentStatus.flowOrder,
                success: paymentStatus.status === 2
            });
        } catch (error) {
            console.error('[Flow Confirm] Error checking payment status:', error);
            return NextResponse.json(
                { message: 'Pago confirmado' }, // Always confirm receipt to Flow
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('[Flow Confirm] Unexpected error:', error);
        // Always return 200 to Flow even if there's an error
        return NextResponse.json(
            { message: 'Pago confirmado' },
            { status: 200 }
        );
    }
}

export async function GET(request: NextRequest) {
    // For GET requests, just call the POST handler
    // This allows for easier testing
    return POST(request);
}