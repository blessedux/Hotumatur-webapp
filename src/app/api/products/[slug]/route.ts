import { NextResponse } from 'next/server';
import { productsService } from '@/services/products.service';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const product = await productsService.getBySlug(params.slug);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to fetch product: ${(error as Error).message}` },
            { status: 500 }
        );
    }
} 