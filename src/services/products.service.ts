import api from '@/lib/api';
import { Product } from '@/types/woocommerce';
import { AxiosError } from 'axios';

export class ProductsService {
    private readonly basePath: string;

    constructor() {

        // Ensure the base path is properly constructed without double slashes
        this.basePath = `https://backend.hotumatur.com/wp-json/wc/v3/products`;
    }

    async getAll(): Promise<Product[]> {
        try {
            const response = await api.get(this.basePath, {
                params: {
                    per_page: 100, // Adjust per_page as needed
                },
            });
            return response.data;
        } catch (error) {
            this.handleError(error as AxiosError);
        }
    }

    async getBySlug(slug: string): Promise<Product | undefined> {
        try {
            const response = await api.get(this.basePath, {
                params: {
                    slug: slug,
                    per_page: 1, // Fetch a single product by slug
                },
            });
            return response.data[0];
        } catch (error) {
            this.handleError(error as AxiosError);
        }
    }

    private handleError(error: AxiosError): never {
        console.error('ProductsService Error:', error.message);
        throw new Error('Error in ProductsService');
    }
}

export const productsService = new ProductsService();