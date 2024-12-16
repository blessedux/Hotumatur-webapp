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
            const formattedData = {
                status: "pending",
                billing: {
                    first_name: orderData.customer.first_name,
                    last_name: orderData.customer.last_name,
                    email: orderData.customer.email,
                    phone: orderData.customer.phone,
                    country: orderData.customer.country
                },
                line_items: orderData.line_items,
                meta_data: orderData.meta_data || [],
                set_paid: false
            };

            const response = await api.post(this.ordersPath, formattedData);
            return response.data;
        } catch (error) {
            console.error('Failed to create order:', error);
            throw error;
        }
    }

    async getOrder(id: number): Promise<Order> {
        try {
            const response = await api.get(`${this.ordersPath}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to get order ${id}:`, error);
            throw error;
        }
    }

    async updateOrder(id: number, data: any): Promise<Order> {
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