import { NextResponse } from 'next/server';
import { productsService } from '@/services/products.service';

type Params = Promise<{ slug: string }>;

export async function GET(
    request: Request,
    { params }: { params: Params }
) {
    try {
        const resolvedParams = await params;
        console.log('Resolved Params:', resolvedParams); // Log the slug
        const product = await productsService.getBySlug(resolvedParams.slug);

        if (!product) {
            console.error('Product not found:', resolvedParams.slug);
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        console.log('Product fetched successfully:', product);
        return NextResponse.json(product);
    } catch (error) {
        console.error('Error in API Route GET:', error.message, error.stack);
        return NextResponse.json(
            { error: `Failed to fetch product: ${(error as Error).message}` },
            { status: 500 }
        );
    }
}