import { NextResponse } from 'next/server';
import { flowService } from '@/services/server/flow.service';
import { wooCommerceService } from '@/services/server/woocommerce.service';
import { config } from '@/config';

export async function POST(request: Request) {
    try {
        const { orderId } = await request.json();
        console.log('orderId', orderId);
        const order = await wooCommerceService.getOrder(orderId);

        const payment = await flowService.createPayment({
            amount: parseInt(order.total),
            email: order.billing.email,
            commerceOrder: `ORDER-${orderId}`,
            subject: `Pago Orden #${orderId} Hotumatur`,
            urlConfirmation: `${config.app.appUrl}/api/payments/flow/confirm`,
            urlReturn: `${config.app.appUrl}/api/payments/flow/success`,
            paymentMethod: 1  // WebPay
        });

        return NextResponse.json({
            success: true,
            paymentUrl: payment.url,
            token: payment.token,
            flowOrder: payment.flowOrder
        });
    } catch (error: unknown) {
        const err = error as import('axios').AxiosError;
        console.error('Error creating payment:', err.response?.data || err);
        return NextResponse.json(
            {
                error: 'Error creating payment',
                details: err.response?.data || err.message
            },
            { status: 500 }
        );
    }
}


