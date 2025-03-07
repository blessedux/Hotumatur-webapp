import { NextResponse } from 'next/server';
import { wooCommerceService } from '@/services/server/woocommerce.service';
import { paypalService } from '@/services/server/paypal.service';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get('token');
        const PayerID = url.searchParams.get('PayerID');

        if (!token || !PayerID) {
            throw new Error('Token and PayerID are required');
        }

        // Capture the payment
        const captureData = await paypalService.capturePayment(token);

        if (captureData.status === 'COMPLETED') {
            // Get the order ID from the reference_id
            const orderId = parseInt(captureData.purchase_units[0].reference_id);

            // Update WooCommerce order
            await wooCommerceService.updateOrder(orderId, {
                status: 'completed',
                meta_data: [
                    {
                        key: 'paypal_order_id',
                        value: token
                    }
                ]
            });

            // Return HTML with redirect
            return new Response(
                `<html>
                    <head>
                        <meta http-equiv="refresh" content="0; url=/checkout/success/${orderId}">
                    </head>
                    <body>
                        Redirigiendo...
                    </body>
                </html>`,
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/html',
                    },
                }
            );
        }

        throw new Error('Payment not completed');
    } catch (error) {
        console.error('Error in PayPal return:', error);
        return NextResponse.json(
            { error: 'Failed to process PayPal return' },
            { status: 500 }
        );
    }
} 