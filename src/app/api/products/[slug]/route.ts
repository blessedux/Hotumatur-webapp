import { NextResponse } from 'next/server';
import { productsService } from '@/services/products.service';

type Params = Promise<{ slug: string }>;

export async function GET(request: Request, { params }: { params: { slug: string } }) {
    try {
        console.log('API Route: Received slug:', params.slug);

        const product = await productsService.getBySlug(params.slug);
        console.log('Fetched product:', product);

        if (!product) {
            console.error('Product not found for slug:', params.slug);
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error in API route:', error.message, error.stack);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}