import api from '@/lib/api';
import { Product } from '@/types/woocommerce';
import { AxiosError } from 'axios';

export class ProductsService {
    private readonly basePath = '/wp-json/wc/v3/products';

    async getAll(): Promise<Product[]> {
        try {
            const response = await api.get(this.basePath, {
                params: {
                    per_page: 100  // or any number higher than your total products
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }

    async getById(id: number): Promise<Product> {
        try {
            const response = await api.get(`${this.basePath}/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }

    private handleError(error: AxiosError): Error {
        console.error('ProductsService Error:', error);
        return new Error('Error in ProductsService');
    }

    async getBySlug(slug: string): Promise<Product> {
        try {
            const products = await this.getAll();
            const product = products.find(product => product.slug === slug);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }
}

export const productsService = new ProductsService();