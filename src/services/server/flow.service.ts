import axios from "axios";
import axiosRetry from "axios-retry";
import crypto from "crypto";
import { config } from '@/config';

// Agregar reintentos a axios
axiosRetry(axios, { retries: 3 });

export class FlowService {
    private readonly apiKey: string;
    private readonly secretKey: string;
    private readonly apiUrl: string;

    constructor() {
        this.apiKey = config.flow.apiKey!;
        this.secretKey = config.flow.secretKey!;
        this.apiUrl = config.flow.apiUrl!;
    }

    private getPack(params: Record<string, string>, method: string): string {
        console.log('Getting pack for params:', params, 'method:', method);

        const sortedKeys = Object.keys(params).sort();
        const data = sortedKeys.map(key => {
            if (method === "GET") {
                return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
            }
            // For POST, Flow expects the parameters without URL encoding in the signature
            return `${key}=${params[key]}`;
        });

        const result = data.join("&");
        console.log('Pack result:', result);
        return result;
    }

    private generateSign(params: Record<string, string>): string {
        const sortedKeys = Object.keys(params).sort();
        const toSign = sortedKeys
            .map(key => `${key}=${params[key]}`)
            .join("&");

        console.log('Generating signature for:', toSign);

        const signature = crypto
            .createHmac('sha256', this.secretKey)
            .update(toSign)
            .digest('hex');

        console.log('Generated signature:', signature);
        return signature;
    }

    async createPayment({
        amount,
        email,
        commerceOrder,
        subject,
        urlConfirmation,
        urlReturn,
        paymentMethod = 9  // Valor por defecto: 9 (todos los medios de pago)
    }: {
        amount: number;
        email: string;
        commerceOrder: string;
        subject: string;
        urlConfirmation: string;
        urlReturn: string;
        paymentMethod?: number;  // Opcional
    }) {
        try {
            // Validate and format email
            const formattedEmail = email.trim().toLowerCase();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formattedEmail)) {
                throw new Error('Invalid email format');
            }

            console.log('Creating Flow payment with params:', {
                amount,
                email: formattedEmail,
                commerceOrder,
                subject,
                urlConfirmation,
                urlReturn,
                paymentMethod
            });

            const params = {
                apiKey: this.apiKey,
                amount: amount.toString(),
                commerceOrder,
                currency: 'CLP',
                email: formattedEmail,
                subject,
                urlConfirmation,
                urlReturn,
                paymentMethod: paymentMethod.toString()
            };

            const data = this.getPack(params, 'POST');
            const sign = this.generateSign(params);

            console.log('Flow API URL:', `${this.apiUrl}/payment/create`);

            const response = await axios.post(
                `${this.apiUrl}/payment/create`,
                `${data}&s=${sign}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            console.log('Flow payment created successfully:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating Flow payment:', error);
            if (error.response) {
                console.error('Flow API error response:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
            }
            throw error;
        }
    }

    async getPaymentStatus(token: string) {

        console.log('se llama a getPaymentStatus');
        try {
            const params = {
                apiKey: this.apiKey,
                token
            };

            const data = this.getPack(params, 'GET');
            const sign = this.generateSign(params);

            const response = await axios.get(
                `${this.apiUrl}/payment/getStatus?${data}&s=${sign}`
            );
            console.log('response', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting Flow payment status:', error);
            throw error;
        }
    }
}

export const flowService = new FlowService();