import { Order, LineItem } from '@/types/woocommerce';

export class OrdersService {
    private readonly basePath = '/api/orders';

    async create(orderData: {
        customer: {
            first_name: string;
            last_name: string;
            email: string;
            phone: string;
        };
        line_items: LineItem[];
    }): Promise<Order> {
        try {
            const response = await fetch(this.basePath, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            return response.json();
        } catch (error) {
            console.error('Failed to create order:', error);
            throw error;
        }
    }

    async getById(id: number): Promise<Order> {
        try {
            const response = await fetch(`${this.basePath}?id=${id}`);

            if (!response.ok) {
                throw new Error(`Failed to get order ${id}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Failed to get order ${id}:`, error);
            throw error;
        }
    }

    async update(id: number, data: any): Promise<any> {
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

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    }
}

export const ordersService = new OrdersService();