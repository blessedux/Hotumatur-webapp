import { Order } from '@/types/woocommerce';

interface OrderResponse {
    success: boolean;
    order: Order;
}

export class OrdersService {
    private readonly basePath: string;

    constructor() {
        const apiUrl = process.env.FLOW_API_URL;
        if (!apiUrl) {
            throw new Error('Environment variable NEXT_PUBLIC_API_URL is not set.');
        }
        this.basePath = `${apiUrl}/api/orders`;
    }


    async getById(id: number): Promise<OrderResponse> {
        try {
            const response = await fetch(`${this.basePath}/${id}`);

            if (!response.ok) {
                throw new Error(`Failed to get order ${id}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Failed to get order ${id}:`, error);
            throw error;
        }
    }

    async update(id: number, data: Partial<Order>): Promise<OrderResponse> {
        try {
            const response = await fetch(`${this.basePath}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to update order');
            }

            return response.json();
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    }
}

export const ordersService = new OrdersService();