import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';

// Setup PayPal client
function getClient() {
    return new paypal.core.PayPalHttpClient(
        new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID!,
            process.env.PAYPAL_CLIENT_SECRET!
        )
    );
}

export async function POST(req: Request) {
    try {
        const { orderId } = await req.json();

        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});

        const client = getClient();
        const response = await client.execute(request);

        return NextResponse.json(response.result);
    } catch (error) {
        console.error('Error capturing PayPal order:', error);
        return NextResponse.json({ error: 'Could not capture order' }, { status: 500 });
    }
}