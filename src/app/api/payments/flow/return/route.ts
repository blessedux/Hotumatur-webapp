import { NextRequest, NextResponse } from 'next/server';
import { flowService } from '@/services/server/flow.service';
import { wooCommerceService } from '@/services/server/woocommerce.service';
import { config } from '@/config';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        // Determine the base URL for redirects
        const origin = request.headers.get('host') || '';
        const protocol = origin.includes('localhost') ? 'http://' : 'https://';
        const baseUrl = `${protocol}${origin}`;

        console.log('[Flow Return] Base URL for redirects:', baseUrl);

        if (!token) {
            console.error('[Flow Return] No token provided in return URL');
            return NextResponse.redirect(`${baseUrl}/checkout/error?error=no_token`);
        }

        console.log('[Flow Return] Payment return with token:', token);

        // Check if this is a mock token (starts with TEST_)
        if (token.startsWith('TEST_')) {
            console.log('[Flow Return] Mock payment detected, processing as successful');

            // For mock payments in development, we'll simulate a successful payment
            // Extract order ID from the token if possible
            const mockOrderId = token.split('_')[1] || Date.now().toString();

            // and redirect to the success page
            return NextResponse.redirect(
                `${baseUrl}/checkout/success?provider=flow&orderId=${mockOrderId}`
            );
        }

        // For real payments, check the payment status
        try {
            const paymentStatus = await flowService.getPaymentStatus(token);
            console.log('[Flow Return] Payment status:', paymentStatus);

            if (paymentStatus.status === 2) { // Status 2 is successful payment
                console.log('[Flow Return] Payment was successful');

                // Update the WooCommerce order if we have a commerceOrder
                if (paymentStatus.commerceOrder) {
                    try {
                        // Update WooCommerce order status to processing
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
                        console.log('[Flow Return] Updated WooCommerce order status for:', paymentStatus.commerceOrder);
                    } catch (updateError) {
                        console.error('[Flow Return] Error updating WooCommerce order:', updateError);
                        // Continue to success page even if order update fails
                    }
                }

                // Redirect to the success page
                return NextResponse.redirect(
                    `${baseUrl}/checkout/success?provider=flow&orderId=${paymentStatus.commerceOrder}&token=${token}`
                );
            }

            console.log('[Flow Return] Payment was not successful, status:', paymentStatus.status);
            return NextResponse.redirect(
                `${baseUrl}/checkout/error?provider=flow&error=payment_failed&status=${paymentStatus.status}&orderId=${paymentStatus.commerceOrder}`
            );
        } catch (error) {
            console.error('[Flow Return] Error checking payment status:', error);
            return NextResponse.redirect(
                `${baseUrl}/checkout/error?error=payment_verification_failed`
            );
        }
    } catch (error) {
        console.error('[Flow Return] Unexpected error:', error);
        return NextResponse.redirect(
            `${config.app.appUrl}/checkout/error?error=unknown`
        );
    }
}

export async function POST() {
    return NextResponse.json({
        message: "Flow return endpoint is working"
    });
} 