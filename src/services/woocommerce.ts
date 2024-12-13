import api from '@/lib/woocommerce';
import { WooProduct, WooCategory } from '@/types/woocommerce';

export async function getProducts(): Promise<WooProduct[]> {
  try {
    const { data } = await api.get<WooProduct[]>('/products');
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getCategories(): Promise<WooCategory[]> {
  try {
    const { data } = await api.get<WooCategory[]>('/categories');
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
