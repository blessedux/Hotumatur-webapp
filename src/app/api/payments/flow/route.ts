import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Parse the request body from the client
        const { orderId } = await request.json();

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Flow API Endpoint
        const flowApiUrl = 'https://flow.cl/api/payments/flow';

        // Proxy the request to the Flow API
        const flowResponse = await fetch(flowApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.FLOW_API_KEY}`, // Replace with your actual Flow API Key
            },
            body: JSON.stringify({ orderId }), // Send the orderId as part of the body
        });

        if (!flowResponse.ok) {
            const errorText = await flowResponse.text();
            console.error('Flow API Error:', errorText);
            return NextResponse.json(
                { error: 'Error creating payment', details: errorText },
                { status: flowResponse.status }
            );
        }

        // Parse and return the Flow API response
        const flowData = await flowResponse.json();

        return NextResponse.json(flowData, { status: 200 });
    } catch (error) {
        console.error('Error in Flow Payment Proxy:', error);
        return NextResponse.json(
            { error: 'Failed to create payment' },
            { status: 500 }
        );
    }
}