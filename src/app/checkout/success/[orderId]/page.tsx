'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function SuccessPage({ params }: { params: { orderId: string } }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { orderId } = params;

    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrderDetails() {
            try {
                const response = await fetch(`/api/orders/${orderId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order details.');
                }

                const data = await response.json();
                setOrderDetails(data);
            } catch (err) {
                console.error(err);
                setError('No se pudo obtener la información del pedido.');
            } finally {
                setLoading(false);
            }
        }

        fetchOrderDetails();
    }, [orderId]);

    const handleGoBack = () => {
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Cargando información del pedido...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-red-500">{error}</p>
                <Button onClick={handleGoBack} className="mt-4">
                    Volver a la página principal
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold text-center mb-6">¡Gracias por tu compra!</h1>

                <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Detalles del Pedido</h2>

                    <div className="space-y-2">
                        <p>
                            <strong>ID del Pedido:</strong> {orderDetails?.id}
                        </p>
                        <p>
                            <strong>Cliente:</strong> {orderDetails?.customer?.first_name}{' '}
                            {orderDetails?.customer?.last_name}
                        </p>
                        <p>
                            <strong>Email:</strong> {orderDetails?.customer?.email}
                        </p>
                        <p>
                            <strong>Método de Pago:</strong>{' '}
                            {orderDetails?.payment_method === 'paypal'
                                ? 'PayPal'
                                : 'WebPay Plus'}
                        </p>
                        <p>
                            <strong>Total Pagado:</strong> $
                            {orderDetails?.total?.toLocaleString('es-CL')}
                        </p>
                    </div>

                    <div className="mt-6">
                        <Button onClick={handleGoBack} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                            Continuar Explorando
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}