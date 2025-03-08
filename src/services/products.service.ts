import api from '@/lib/api';
import { Product } from '@/types/woocommerce';
import { AxiosError } from 'axios';

export class ProductsService {
    private readonly basePath: string;

    constructor() {
        this.basePath = `https://backend.hotumatur.com/wp-json/wc/v3/products`;
    }

    async getAll(language: string = 'es'): Promise<Product[]> {
        try {
            console.log(`Fetching all products from: ${this.basePath} in language: ${language}`);
            const response = await api.get(this.basePath, {
                params: {
                    per_page: 100,
                    lang: language
                },
            });

            console.log('Raw products response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in getAll:', error);
            this.handleError(error as AxiosError);
        }
    }

    async getBySlug(slug: string, language: string = 'es'): Promise<Product | undefined> {
        try {
            console.log(`Fetching product with slug: ${slug} in language: ${language}`);
            const response = await api.get(this.basePath, {
                params: {
                    slug: slug,
                    lang: language
                },
                // Disable caching to ensure fresh data
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });

            console.log('Raw product response:', response.data);

            if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
                console.log('No product found for slug:', slug);
                return undefined;
            }

            // Return the first product that matches the slug
            return response.data[0];
        } catch (error) {
            console.error('Error in getBySlug:', error);
            this.handleError(error as AxiosError);
        }
    }

    private handleError(error: AxiosError): never {
        console.error('ProductsService Error:', error.message);
        throw new Error(`Error in ProductsService: ${error.message}`);
    }
}

export const productsService = new ProductsService();