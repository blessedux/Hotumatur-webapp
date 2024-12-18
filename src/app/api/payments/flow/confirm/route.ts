import { NextResponse } from 'next/server';
import { flowService } from '@/services/server/flow.service';
import { wooCommerceService } from '@/services/server/woocommerce.service';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const token = formData.get('token') as string;

        if (!token) {
            throw new Error('Token is required');
        }

        console.log('aqui vamos ctm');

        const paymentStatus = await flowService.getPaymentStatus(token);

        console.log('paymentStatus', paymentStatus);
        const orderId = parseInt(paymentStatus.commerceOrder.replace('ORDER-', ''));
        console.log('orderId', orderId);
        console.log('paymentStatus.status', paymentStatus.status);

        if (paymentStatus.status === 2) { // 2 = Pago exitoso
            await wooCommerceService.updateOrder(orderId, {
                status: 'completed',
                meta_data: [
                    {
                        key: 'flow_token',
                        value: token
                    },
                    {
                        key: 'flow_payment_date',
                        value: new Date().toISOString()
                    },
                    {
                        key: 'flow_payment_method',
                        value: paymentStatus.paymentData.media
                    }
                ]
            });

            return NextResponse.json(
                { success: true },
                { status: 200 }
            );
        }

        // Si el pago no fue exitoso
        await wooCommerceService.updateOrder(orderId, {
            status: 'failed',
            meta_data: [
                {
                    key: 'flow_token',
                    value: token
                },
                {
                    key: 'flow_status',
                    value: paymentStatus.status
                }
            ]
        });

        return NextResponse.json({
            success: false,
            status: paymentStatus.status
        });

    } catch (error) {
        console.error('Error confirming payment:', error);
        return NextResponse.json(
            { error: 'Failed to confirm payment' },
            { status: 500 }
        );
    }
}