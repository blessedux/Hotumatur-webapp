// src/services/server/woocommerce.service.ts
import api from '@/lib/api';
import { Order } from '@/types/woocommerce';

export class WooCommerceService {
    private readonly ordersPath = '/wp-json/wc/v3/orders';

    async createOrder(orderData: {
        customer: {
            first_name: string;
            last_name: string;
            email: string;
            phone: string;
            country: string;
        };
        line_items: Array<{
            product_id: number;
            quantity: number;
            meta_data: Array<{
                key: string;
                value: string;
            }>;
        }>;
        meta_data?: Array<{
            key: string;
            value: string;
        }>;
    }): Promise<Order> {
        try {
            console.log('[WooCommerce] Creating order with data:', {
                customer: {
                    ...orderData.customer,
                    email: '***@***' // Mask email for logging
                },
                lineItems: orderData.line_items.length
            });

            // Validate and format email
            const formattedEmail = orderData.customer.email.trim().toLowerCase();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formattedEmail)) {
                throw new Error('Invalid email format');
            }

            const formattedData = {
                status: "pending",
                billing: {
                    first_name: orderData.customer.first_name,
                    last_name: orderData.customer.last_name,
                    email: formattedEmail,
                    phone: orderData.customer.phone,
                    country: orderData.customer.country
                },
                line_items: orderData.line_items,
                meta_data: orderData.meta_data || [],
                set_paid: false
            };

            console.log('[WooCommerce] Sending order creation request');
            const response = await api.post(this.ordersPath, formattedData);
            console.log('[WooCommerce] Order created successfully:', {
                orderId: response.data.id,
                status: response.data.status,
                total: response.data.total
            });

            return response.data;
        } catch (error: any) {
            console.error('[WooCommerce] Failed to create order:', error);

            // Extract detailed error information
            const errorDetails = {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                url: error.config?.url
            };

            console.error('[WooCommerce] Error details:', errorDetails);

            // Throw enhanced error
            throw new Error(`Failed to create order: ${JSON.stringify(errorDetails)}`);
        }
    }

    async getOrder(id: number): Promise<Order> {
        try {
            console.log(`[WooCommerce] Getting order ${id}`);
            console.log(`[WooCommerce] API URL: ${this.ordersPath}/${id}`);

            const response = await api.get(`${this.ordersPath}/${id}`);
            console.log(`[WooCommerce] Order ${id} retrieved successfully:`, {
                status: response.status,
                orderId: response.data.id,
                total: response.data.total
            });

            return response.data;
        } catch (error: any) {
            console.error(`[WooCommerce] Failed to get order ${id}:`, error);

            // Extract detailed error information
            const errorDetails = {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                url: error.config?.url
            };

            console.error('[WooCommerce] Error details:', errorDetails);

            // Throw enhanced error
            throw new Error(`Failed to get order ${id}: ${JSON.stringify(errorDetails)}`);
        }
    }

    async updateOrder(id: number, data: Partial<Order>): Promise<Order> {
        try {
            const response = await api.put(`${this.ordersPath}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Failed to update order ${id}:`, error);
            throw error;
        }
    }
}

export const wooCommerceService = new WooCommerceService();