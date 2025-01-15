import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const event = await req.json();
        console.log('PayPal Webhook Received:', event);

        if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
            console.log('✅ Payment Successful:', event.resource);
            // Handle the successful payment (store it in the database, send confirmation, etc.)
        } else {
            console.log('ℹ️ Webhook Event:', event.event_type);
        }

        return NextResponse.json({ status: 'Webhook received' });
    } catch (error) {
        console.error('❌ Error handling PayPal webhook:', error);
        return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
    }
}