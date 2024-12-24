import { NextResponse } from 'next/server';
import { productsService } from '@/services/products.service';

export async function GET(
    request: Request,
    context: { params: { slug: string } }
) {
    const { params } = context;

    try {
        console.log('Fetching product for slug:', params.slug);
        const product = await productsService.getBySlug(params.slug);

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}