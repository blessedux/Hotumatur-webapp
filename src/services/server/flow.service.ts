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
        const sortedKeys = Object.keys(params).sort();
        const data = sortedKeys.map(key => {
            if (method === "GET") {
                return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
            }
            return `${key}=${params[key]}`;
        });
        return data.join("&");
    }

    private generateSign(params: Record<string, string>): string {
        const sortedKeys = Object.keys(params).sort();
        const toSign = sortedKeys
            .map(key => `${key}=${params[key]}`)
            .join("&");

        return crypto
            .createHmac('sha256', this.secretKey)
            .update(toSign)
            .digest('hex');
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
            const params = {
                apiKey: this.apiKey,
                amount: amount.toString(),
                commerceOrder,
                currency: 'CLP',
                email,
                subject,
                urlConfirmation,
                urlReturn,
                paymentMethod: paymentMethod.toString()
            };

            const data = this.getPack(params, 'POST');
            const sign = this.generateSign(params);

            const response = await axios.post(
                `${this.apiUrl}/payment/create`,
                `${data}&s=${sign}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error creating Flow payment:', error);
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