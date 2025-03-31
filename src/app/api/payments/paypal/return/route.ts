import { NextResponse } from 'next/server';
import axios from 'axios';
import { wooCommerceService } from '@/services/server/woocommerce.service';
import { config } from '@/config';

/**
 * Get PayPal access token for API requests
 */
async function getPayPalAccessToken() {
    try {
        const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
        const response = await axios.post(
            `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.access_token;
    } catch (error: any) {
        console.error('Error getting PayPal access token:', error.response?.data || error);
        throw new Error('Failed to get PayPal access token');
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        if (!token) {
            throw new Error('No PayPal token provided');
        }

        console.log('Processing PayPal return with token:', token);

        // For development environment, use a mock successful response
        if (process.env.NODE_ENV === 'development') {
            console.log('[PayPal] Development mode - simulating successful payment');
            const mockOrderId = `dev-${Date.now()}`;

            return NextResponse.redirect(`${config.app.appUrl}/checkout/success?provider=paypal&orderId=${mockOrderId}`);
        }

        const accessToken = await getPayPalAccessToken();

        // Capture the payment
        const captureResponse = await axios.post(
            `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${token}/capture`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const captureData = captureResponse.data;
        console.log('Payment captured:', captureData);

        // Get the WooCommerce order ID from the purchase unit reference
        const wooOrderId = captureData.purchase_units[0].reference_id;

        // Update the WooCommerce order status
        await wooCommerceService.updateOrder(parseInt(wooOrderId), {
            status: 'processing',
            meta_data: [
                {
                    key: 'paypal_transaction_id',
                    value: captureData.id
                },
                {
                    key: 'payment_method',
                    value: 'PayPal'
                }
            ]
        });

        console.log('WooCommerce order updated:', wooOrderId);

        // Redirect to success page
        return NextResponse.redirect(`${config.app.appUrl}/checkout/success?provider=paypal&orderId=${wooOrderId}`);
    } catch (error: any) {
        console.error('Error processing PayPal return:', error.response?.data || error);

        const errorMsg = error.message || 'Unknown error';
        return NextResponse.redirect(`${config.app.appUrl}/checkout/error?provider=paypal&message=${encodeURIComponent(errorMsg)}`);
    }
} 