import api from '@/lib/api';
import { Product } from '@/types/woocommerce';
import { AxiosError } from 'axios';

export class ProductsService {
    private readonly basePath: string;

    constructor() {
        this.basePath = `https://backend.hotumatur.com/wp-json/wc/v3/products`;
    }

    async getAll(): Promise<Product[]> {
        try {
            console.log('Fetching all products from:', this.basePath);
            const response = await api.get(this.basePath, {
                params: {
                    per_page: 100,
                },
            });

            console.log('Raw products response:', response.data);

            // Process each product to extract English descriptions from meta data
            const products = response.data.map((product: any) => {
                const description_en = product.meta_data?.find((meta: any) => meta.key === 'description_en')?.value || '';
                const short_description_en = product.meta_data?.find((meta: any) => meta.key === 'short_description_en')?.value || '';

                return {
                    ...product,
                    description_en,
                    short_description_en
                };
            });

            console.log('Processed products:', products);
            return products;
        } catch (error) {
            console.error('Error in getAll:', error);
            this.handleError(error as AxiosError);
        }
    }

    async getBySlug(slug: string): Promise<Product | undefined> {
        try {
            console.log('Fetching product by slug:', slug);
            const response = await api.get(this.basePath, {
                params: {
                    slug: slug,
                },
            });

            console.log('Raw product response:', response.data);

            if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
                console.log('No product found for slug:', slug);
                return undefined;
            }

            // Process the product to extract English descriptions
            const product = response.data[0];

            // Log all meta_data for debugging
            console.log('Product meta_data:', product.meta_data);

            // Look for all possible English translation keys
            const description_en = product.meta_data?.find((meta: any) =>
                meta.key === 'description_en' ||
                meta.key === '_description_en' ||
                meta.key === 'content_en'
            )?.value || '';

            const short_description_en = product.meta_data?.find((meta: any) =>
                meta.key === 'short_description_en' ||
                meta.key === '_short_description_en'
            )?.value || '';

            const name_en = product.meta_data?.find((meta: any) =>
                meta.key === 'name_en' ||
                meta.key === '_name_en' ||
                meta.key === 'title_en'
            )?.value || '';

            // Process attributes to include English translations
            const processedAttributes = product.attributes.map((attr: any) => {
                const attributeKey = attr.name.toLowerCase();
                const englishKey = `attribute_${attributeKey}_en`;
                const englishValue = product.meta_data?.find((meta: any) =>
                    meta.key === englishKey ||
                    meta.key === `${attributeKey}_en` ||
                    meta.key === attr.name + '_en'
                )?.value;

                return {
                    ...attr,
                    options_en: englishValue ? [englishValue] : attr.options
                };
            });

            const processedProduct = {
                ...product,
                name_en,
                description_en,
                short_description_en,
                attributes: processedAttributes
            };

            // Log processed translations for debugging
            console.log('Processed translations:', {
                name: { original: product.name, english: name_en },
                description: { original: product.description, english: description_en },
                short_description: { original: product.short_description, english: short_description_en }
            });

            return processedProduct;
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