'use client'

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { ordersService } from '@/services/orders.service';
import { Order } from '@/types/woocommerce';
import { Button } from "@/components/ui/button"

interface Props {
    params: Promise<{ orderId: string }>;
}

export default function SuccessPage({ params }: Props) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [order, setOrder] = useState<Order | null>(null);
    const [countdown, setCountdown] = useState(10);
    const { toast } = useToast();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await ordersService.getById(Number(resolvedParams.orderId));
                if (response.success && response.order) {
                    setOrder(response.order);
                }
            } catch {
                toast({
                    title: "Error",
                    description: "No se pudo cargar la información de la orden",
                    variant: "destructive"
                })
            }
        };

        fetchOrder();
    }, [resolvedParams.orderId, toast]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            router.push('/');
        }
    }, [countdown, router]);

    const handleRedirect = () => {
        router.push('/');
    };

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin">⏳</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-2xl mx-auto text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>
                <p className="text-gray-600 mb-8">
                    Tu número de orden es: #{order.number}
                </p>
                <div className="bg-gray-50 p-6 rounded-lg text-left mb-8">
                    <h2 className="font-semibold mb-4">Detalles de la orden</h2>
                    <div className="space-y-2">
                        <p>Estado: {order.status}</p>
                        <p>Total: {order.currency_symbol}{Number(order.total).toLocaleString('es-CL')}</p>
                        {order.billing?.email && <p>Email: {order.billing.email}</p>}
                    </div>
                </div>
                <p className="text-gray-600 mb-4">
                    Serás redirigido a Hotumatur en {countdown} segundos
                </p>
                <Button
                    onClick={handleRedirect}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Volver a Hotumatur
                </Button>
            </div>
        </div>
    );
} 