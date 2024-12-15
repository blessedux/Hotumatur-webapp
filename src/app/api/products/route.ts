import { NextResponse } from 'next/server';
import { productsService } from '@/services/products.service';

export async function GET() {
    try {
        const products = await productsService.getAll();
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to fetch products: ${(error as Error).message}` },
            { status: 500 }
        );
    }
}