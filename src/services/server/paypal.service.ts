import { config } from '@/config';

export class PayPalService {
    private readonly apiUrl: string;
    private readonly clientId: string;
    private readonly clientSecret: string;

    constructor() {
        this.apiUrl = process.env.PAYPAL_API_URL || '';
        this.clientId = process.env.PAYPAL_CLIENT_ID || '';
        this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';

        if (!this.apiUrl || !this.clientId || !this.clientSecret) {
            throw new Error('PayPal environment variables are not properly configured');
        }
    }

    private async getAccessToken(): Promise<string> {
        const response = await fetch(`${this.apiUrl}/v1/oauth2/token`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `${this.clientId}:${this.clientSecret}`
                ).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials",
        });

        if (!response.ok) {
            throw new Error("Failed to get PayPal access token");
        }

        const data = await response.json();
        return data.access_token;
    }

    async createPayment(params: {
        amount: string;
        orderId: string;
        email: string;
    }) {
        const accessToken = await this.getAccessToken();

        const response = await fetch(`${this.apiUrl}/v2/checkout/orders`, {
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
                        value: params.amount
                    },
                    reference_id: params.orderId
                }],
                application_context: {
                    brand_name: "Hotumatur",
                    return_url: `${config.app.appUrl}/api/payments/paypal/return`,
                    cancel_url: `${config.app.appUrl}/checkout`
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("PayPal API Error:", errorData);
            throw new Error("Failed to create PayPal order");
        }

        const paypalOrder = await response.json();
        return {
            url: paypalOrder.links.find((link: any) => link.rel === "approve").href,
            token: paypalOrder.id,
            paypalOrder: paypalOrder.id
        };
    }

    async capturePayment(token: string) {
        const response = await fetch(`${this.apiUrl}/v2/checkout/orders/${token}/capture`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `${this.clientId}:${this.clientSecret}`
                ).toString("base64")}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to capture PayPal payment');
        }

        return response.json();
    }
}

export const paypalService = new PayPalService(); 