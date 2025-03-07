import { NextResponse } from "next/server";
import { wooCommerceService } from '@/services/server/woocommerce.service';
import { paypalService } from '@/services/server/paypal.service';

export async function POST(request: Request) {
    try {
        const { orderId } = await request.json();
        const order = await wooCommerceService.getOrder(orderId);

        const payment = await paypalService.createPayment({
            amount: order.total,
            orderId: orderId.toString(),
            email: order.billing.email
        });

        return NextResponse.json({
            success: true,
            paymentUrl: payment.url,
            token: payment.token,
            paypalOrder: payment.paypalOrder
        });
    } catch (error: any) {
        console.error('Error creating PayPal payment:', error);
        return NextResponse.json(
            {
                error: 'Error creating payment',
                details: error.message
            },
            { status: 500 }
        );
    }
}