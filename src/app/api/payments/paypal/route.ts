import { NextResponse } from "next/server";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_BASE_URL = process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

// Function to get PayPal OAuth Token
const getPayPalToken = async () => {
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });

    if (!response.ok) {
        throw new Error("Failed to get PayPal token");
    }

    const data = await response.json();
    return data.access_token;
};

// Function to create a PayPal order
export async function POST(req: Request) {
    try {
        const { orderId } = await req.json();
        const accessToken = await getPayPalToken();

        const orderResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [{
                    amount: {
                        currency_code: "USD",
                        value: "100.00" // Replace with dynamic price calculation
                    },
                    reference_id: orderId
                }],
                application_context: {
                    brand_name: "Hotumatur",
                    return_url: "https://yourwebsite.com/api/payments/paypal/success",
                    cancel_url: "https://yourwebsite.com/checkout"
                }
            }),
        });

        if (!orderResponse.ok) {
            throw new Error("Failed to create PayPal order");
        }

        const orderData = await orderResponse.json();
        return NextResponse.json({ approvalUrl: orderData.links.find(link => link.rel === "approve")?.href });
    } catch (error) {
        console.error("Error processing PayPal order:", error);
        return NextResponse.json({ error: "Failed to process PayPal order" }, { status: 500 });
    }
}