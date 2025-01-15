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
        const { amount, currency, description } = await req.json();

        const request = new paypal.orders.OrdersCreateRequest();
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: currency || 'USD',
                    value: amount
                },
                description
            }]
        });

        const client = getClient();
        const response = await client.execute(request);
        
        return NextResponse.json({ id: response.result.id });
    } catch (error) {
        console.error('Error creating PayPal order:', error);
        return NextResponse.json({ error: 'Could not create order' }, { status: 500 });
    }
}