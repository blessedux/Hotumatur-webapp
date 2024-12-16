import api from '@/lib/api';
import { Product } from '@/types/woocommerce';
import { AxiosError } from 'axios';

export class ProductsService {
    private readonly basePath = '/wp-json/wc/v3/products';

    async getAll(): Promise<Product[]> {
        try {
            const response = await api.get(this.basePath, {
                params: {
                    per_page: 100
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }

    async getBySlug(slug: string): Promise<Product | undefined> {
        try {
            const response = await api.get(this.basePath, {
                params: {
                    slug: slug,
                    per_page: 1
                }
            });
            return response.data[0];
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }

    private handleError(error: AxiosError): Error {
        console.error('ProductsService Error:', error);
        return new Error('Error in ProductsService');
    }
}

export const productsService = new ProductsService();