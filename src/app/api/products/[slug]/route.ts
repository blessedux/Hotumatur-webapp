import { NextResponse } from 'next/server';
import { productsService } from '@/services/products.service';

type Params = Promise<{ slug: string }>

export async function GET(
    request: Request,
    { params }: { params: Params }
) {
    try {
        const resolvedParams = await params;
        const product = await productsService.getBySlug(resolvedParams.slug);

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