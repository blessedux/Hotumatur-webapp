import { NextResponse } from 'next/server';

export async function POST() {
    console.log('ESTOY EN EL ROUTE DE CONFIRMACION DE PAGO');
    return NextResponse.json({ message: 'Pago confirmado' });
}

export async function GET() {
    console.log('ESTOY EN EL ROUTE DE CONFIRMACION DE PAGO');
    return NextResponse.json({ message: 'Pago confirmado' });
}