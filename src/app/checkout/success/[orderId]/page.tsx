'use client'

import { ordersService } from '@/services/orders.service';
import { CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast"

interface Props {
    params: {
        orderId: string;
    };
}

export default function SuccessPage({ params }: Props) {
    const [order, setOrder] = useState<any>(null);
    const { toast } = useToast()

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await ordersService.getById(Number(params.orderId));
                if (response.success && response.order) {
                    setOrder(response.order);
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "No se pudo cargar la información de la orden",
                    variant: "destructive"
                })
            }
        };

        fetchOrder();
    }, [params.orderId, toast]);

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
                <div className="bg-gray-50 p-6 rounded-lg text-left">
                    <h2 className="font-semibold mb-4">Detalles de la orden</h2>
                    <div className="space-y-2">
                        <p>Estado: {order.status}</p>
                        <p>Total: {order.currency_symbol}{Number(order.total).toLocaleString('es-CL')}</p>
                        {order.billing?.email && <p>Email: {order.billing.email}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
} 