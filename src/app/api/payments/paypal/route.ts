import { NextResponse } from "next/server";
import axios from 'axios';
import { wooCommerceService } from '@/services/server/woocommerce.service';
import { config } from '@/config';

async function getPayPalAccessToken() {
    const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    try {
        const response = await axios.post(
            `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting PayPal access token:', error.response?.data || error);
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        const { orderId } = await request.json();
        console.log('Processing PayPal payment for order:', orderId);

        const order = await wooCommerceService.getOrder(orderId);
        console.log('Order retrieved:', { orderId, total: order.total });

        const accessToken = await getPayPalAccessToken();
        console.log('PayPal access token obtained');

        const paypalOrder = await axios.post(
            `${process.env.PAYPAL_API_URL}/v2/checkout/orders`,
            {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        reference_id: orderId.toString(),
                        description: `Orden #${orderId} en Hotumatur`,
                        amount: {
                            currency_code: 'USD',
                            value: order.total
                        }
                    }
                ],
                application_context: {
                    return_url: `${config.app.appUrl}/api/payments/paypal/return`,
                    cancel_url: `${config.app.appUrl}/checkout?canceled=true`
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('PayPal order created:', paypalOrder.data);

        const approvalUrl = paypalOrder.data.links.find(
            (link: any) => link.rel === 'approve'
        ).href;

        return NextResponse.json({
            success: true,
            paymentUrl: approvalUrl
        });
    } catch (error) {
        console.error('Error creating PayPal payment:', error.response?.data || error);
        return NextResponse.json(
            { error: 'Error creating payment', details: error.response?.data || error.message },
            { status: 500 }
        );
    }
}