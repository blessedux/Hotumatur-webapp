import { NextResponse } from 'next/server';
import { wooCommerceService } from '@/services/server/woocommerce.service';
import { flowService } from '@/services/server/flow.service';

export async function POST(request: Request) {
    try {
        const body = await request.text();
        console.log('body received:', body);

        const params = new URLSearchParams(body);
        const token = params.get('token');

        if (!token) {
            throw new Error('Token is required');
        }

        // Obtener el estado del pago desde Flow
        const paymentStatus = await flowService.getPaymentStatus(token);
        const orderId = parseInt(paymentStatus.commerceOrder.replace('ORDER-', ''));

        // Actualizar la orden con el token de Flow
        await wooCommerceService.updateOrder(orderId, {
            meta_data: [
                {
                    key: 'flow_token',
                    value: token
                },
                {
                    key: 'flow_payment_date',
                    value: new Date().toISOString()
                }
            ]
        });

        // Retornar HTML con redirección automática
        return new Response(
            `
            <html>
                <head>
                    <meta http-equiv="refresh" content="0; url=/checkout/success/${orderId}">
                </head>
                <body>
                    Redirigiendo...
                </body>
            </html>
            `,
            {
                status: 200,
                headers: {
                    'Content-Type': 'text/html',
                },
            }
        );

    } catch (error) {
        console.error('Error in success callback:', error);
        return NextResponse.json(
            { error: 'Failed to process success callback' },
            { status: 500 }
        );
    }
} 