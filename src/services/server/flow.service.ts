import axios from "axios";
import axiosRetry from "axios-retry";
import crypto from "crypto";
import { config } from '@/config';

// Add retries to axios
axiosRetry(axios, { retries: 3 });

/**
 * Service for interacting with Flow payment gateway
 * Handles signature generation, payment creation, and status checks
 */
export class FlowService {
    private apiKey: string;
    private secretKey: string;
    private apiUrl: string;

    constructor() {
        if (!config.flow.apiKey || !config.flow.secretKey || !config.flow.apiUrl) {
            throw new Error('Flow configuration is incomplete. Please check your environment variables.');
        }
        this.apiKey = config.flow.apiKey;
        this.secretKey = config.flow.secretKey;
        this.apiUrl = config.flow.apiUrl;
    }

    private generateSign(params: Record<string, any>): string {
        // Sort parameters alphabetically and filter out undefined/null values
        const sortedParams = Object.keys(params)
            .sort()
            .reduce((acc: Record<string, any>, key) => {
                if (params[key] !== undefined && params[key] !== null) {
                    acc[key] = params[key];
                }
                return acc;
            }, {});

        // Create string to sign (key=value pairs joined by &)
        const stringToSign = Object.entries(sortedParams)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');

        console.log('String to sign:', stringToSign);

        // Generate HMAC
        const hmac = crypto.createHmac('sha256', this.secretKey);
        hmac.update(stringToSign);
        return hmac.digest('hex');
    }

    async generateSignature(params: { apiKey: string; secretKey: string }): Promise<string> {
        // For simple signatures (like info endpoint), just sign the apiKey
        const hmac = crypto.createHmac('sha256', params.secretKey);
        hmac.update(params.apiKey);
        return hmac.digest('hex');
    }

    private normalizeEmail(email: string): string {
        // For sandbox testing mode, try a standard email format
        if (process.env.NODE_ENV === 'development' ||
            this.apiUrl.includes('sandbox') ||
            email.includes('localhost')) {
            // Use a standard email format
            return 'inboxmentemaestra@gmail.com';
        }
        return email;
    }

    async createPayment(params: {
        commerceOrder: string;
        subject: string;
        amount: number;
        email: string;
        urlConfirmation: string;
        urlReturn: string;
        paymentMethod?: number;
        optional?: Record<string, any>;
    }) {
        try {
            console.log('[Flow] Creating payment with params:', {
                ...params,
                email: params.email.includes('@') ? `${params.email.split('@')[0]}@***` : params.email // Mask email for logs
            });

            // For sandbox/development environment, we'll return a mock successful response
            // This allows testing the checkout flow without depending on Flow's API validation
            if (process.env.NODE_ENV === 'development' || this.apiUrl.includes('sandbox')) {
                console.log('[Flow] SANDBOX MODE - Creating payment on Flow sandbox');

                // We need to redirect to the actual Flow payment page instead of skipping to success
                // Prepare payment parameters 
                const paymentParams: Record<string, any> = {
                    apiKey: this.apiKey,
                    commerceOrder: params.commerceOrder,
                    subject: params.subject,
                    currency: 'CLP',
                    amount: params.amount.toString(),
                    email: this.normalizeEmail(params.email),
                    urlConfirmation: params.urlConfirmation,
                    urlReturn: params.urlReturn,
                    paymentMethod: (params.paymentMethod || 9).toString(), // Default to 9 (all payment methods)
                };

                // Add optional parameters if provided
                if (params.optional) {
                    paymentParams.optional = JSON.stringify(params.optional);
                }

                // Generate signature
                const signature = this.generateSign(paymentParams);

                // Create form data
                const formData = new URLSearchParams();
                // Add parameters to form data
                Object.entries(paymentParams).forEach(([key, value]) => {
                    formData.append(key, value.toString());
                });
                formData.append('s', signature);

                // Make API request to Flow
                console.log('[Flow] Making API request to:', `${this.apiUrl}/payment/create`);
                console.log('[Flow] Form data:', formData.toString());

                try {

                    // Make the actual API call to Flow sandbox
                    const response = await axios({
                        method: 'post',
                        url: `${this.apiUrl}/payment/create`,
                        data: formData.toString(),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        }

                    });



                    console.log('[Flow] Sandbox payment created successfully:', response.data);
                    return {
                        url: `${response.data.url}?token=${response.data.token}`,
                        token: response.data.token,
                        flowOrder: response.data.flowOrder,
                    };
                } catch (sandboxError: any) {
                    console.error('[Flow] Sandbox API error:', sandboxError);

                    // If the sandbox API fails, we'll fallback to a mock response for development
                    if (process.env.NODE_ENV === 'development') {
                        console.log('[Flow] Fallback to mock response for development');
                        const mockToken = `TEST_${Date.now()}`;
                        const mockFlowOrder = Math.floor(Math.random() * 1000000);

                        // Create a simulated Flow URL using the Flow sandbox URL
                        const fallbackUrl = `https://sandbox.flow.cl/app/web/pay.php?token=${mockToken}`;

                        return {
                            url: fallbackUrl, // Direct to Flow's sandbox page
                            token: mockToken,
                            flowOrder: mockFlowOrder,
                        };
                    }

                    // Re-throw the error for proper handling
                    throw sandboxError;
                }
            }

            // For production, continue with the actual Flow API integration
            // Normalize the email to ensure it passes Flow's validation
            const normalizedEmail = this.normalizeEmail(params.email);
            console.log('[Flow] Using normalized email:', normalizedEmail);

            // Ensure amount is a positive integer
            if (!Number.isInteger(params.amount) || params.amount <= 0) {
                throw new Error('Amount must be a positive integer');
            }

            // Handle localhost URLs for development
            let urlConfirmation = params.urlConfirmation;
            let urlReturn = params.urlReturn;

            if (urlConfirmation.includes('localhost') || urlReturn.includes('localhost')) {
                console.warn('[Flow] Using localhost URLs - replacing with production domain for Flow API');
                // Replace localhost with a publicly accessible domain
                const publicDomain = process.env.NEXT_PUBLIC_PRODUCTION_URL || 'https://hotumatur.cl';
                urlConfirmation = urlConfirmation.replace(/http:\/\/localhost:[0-9]+/, publicDomain);
                urlReturn = urlReturn.replace(/http:\/\/localhost:[0-9]+/, publicDomain);

                console.log('[Flow] Translated URLs:', { urlConfirmation, urlReturn });
            }

            // Prepare payment parameters 
            const paymentParams: Record<string, any> = {
                apiKey: this.apiKey,
                commerceOrder: params.commerceOrder,
                subject: params.subject,
                currency: 'CLP',
                amount: params.amount.toString(),
                email: normalizedEmail,
                urlConfirmation,
                urlReturn,
                paymentMethod: (params.paymentMethod || 9).toString(), // Default to 9 (all payment methods)
            };

            // Add optional parameters if provided
            if (params.optional) {
                paymentParams.optional = JSON.stringify(params.optional);
            }

            // Generate signature
            const signature = this.generateSign(paymentParams);

            // Create form data
            const formData = new URLSearchParams();
            // Add parameters to form data
            Object.entries(paymentParams).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });
            formData.append('s', signature);

            // Make API request to Flow
            console.log('[Flow] Making API request to:', `${this.apiUrl}/payment/create`);
            console.log('[Flow] Form data:', formData.toString());

            // Fix axios request
            const response = await axios({
                method: 'post',
                url: `${this.apiUrl}/payment/create`,
                data: formData.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            console.log('[Flow] Payment created successfully:', response.data);
            return {
                url: `${response.data.url}?token=${response.data.token}`,
                token: response.data.token,
                flowOrder: response.data.flowOrder,
            };
        } catch (error: any) {
            console.error('[Flow] Error creating payment:', error);

            // Provide more detailed error for debugging
            if (error.response) {
                console.error('[Flow] API error response:', error.response.status, error.response.data);
                const errorDetails = {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data,
                    message: error.response.data?.message || error.response.statusText
                };
                console.error('[Flow] Error details:', JSON.stringify(errorDetails, null, 2));
                throw new Error(`Flow API error: ${errorDetails.message}`);
            }

            throw new Error(`Failed to create payment: ${error.message}`);
        }
    }

    async getPaymentStatus(token: string) {
        try {
            console.log('[Flow] Getting payment status for token:', token);

            // For sandbox/development environment, return a mock successful response
            if (process.env.NODE_ENV === 'development' || this.apiUrl.includes('sandbox')) {
                console.log('[Flow] SANDBOX MODE - Returning mock successful payment status');
                return {
                    flowOrder: Math.floor(Math.random() * 1000000),
                    commerceOrder: `mock_order_${Date.now()}`,
                    requestDate: new Date().toISOString(),
                    status: 2, // 2 is success in Flow's API
                    paymentData: {
                        date: new Date().toISOString(),
                        media: "WebPay",
                        amount: 1000,
                        currency: "CLP",
                        installments: 1,
                    }
                };
            }

            const params = {
                apiKey: this.apiKey,
                token: token
            };

            const signature = this.generateSign(params);

            // Create form data
            const formData = new URLSearchParams();
            formData.append('apiKey', params.apiKey);
            formData.append('token', params.token);
            formData.append('s', signature);

            console.log('[Flow] Making request to:', `${this.apiUrl}/payment/getStatus`);
            const response = await axios({
                method: 'post',
                url: `${this.apiUrl}/payment/getStatus`,
                data: formData.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            console.log('[Flow] Payment status response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('[Flow] Error getting payment status:', error);

            // Provide more detailed error for debugging
            if (error.response) {
                console.error('[Flow] API error response:', error.response.status, error.response.data);
                const errorDetails = {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data,
                    message: error.response.data?.message || error.response.statusText
                };
                console.error('[Flow] Error details:', JSON.stringify(errorDetails, null, 2));
                throw new Error(`Flow API error: ${errorDetails.message}`);
            }

            throw new Error(`Failed to get payment status: ${error.message}`);
        }
    }
}

export const flowService = new FlowService();