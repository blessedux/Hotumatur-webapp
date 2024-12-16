'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ordersService } from '@/services/orders.service'
import { Order } from '@/types/woocommerce'
import { useToast } from "@/hooks/use-toast"
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { ShoppingCart, CreditCard, Building2 } from 'lucide-react'

export default function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const { toast } = useToast()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'webpay' | 'transfer' | null>(null)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await ordersService.getById(Number(resolvedParams.orderId))
                if (response.success && response.order) {
                    setOrder(response.order)
                } else {
                    throw new Error('No order data found')
                }
            } catch {
                toast({
                    title: "Error",
                    description: "No se pudo cargar la información de la orden",
                    variant: "destructive"
                })
                router.push('/checkout')
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [resolvedParams.orderId, router, toast])

    const handlePayment = async () => {
        if (!selectedPaymentMethod || !order) {
            toast({
                title: "Error",
                description: "Por favor selecciona un método de pago",
                variant: "destructive"
            })
            return
        }

        try {
            if (selectedPaymentMethod === 'webpay') {
                // Integración con WebPay
                toast({
                    title: "Procesando pago",
                    description: "Redirigiendo a WebPay...",
                })
            } else {
                // Transferencia bancaria
                setLoading(true)
                toast({
                    title: "Transferencia bancaria",
                    description: "Procesando tu solicitud...",
                })

                // Actualizar el estado de la orden a "completed"
                const updateResponse = await ordersService.update(order.id, {
                    status: "completed",
                    payment_method: "bank_transfer",
                    payment_method_title: "Transferencia Bancaria",
                    set_paid: true
                });

                if (!updateResponse.success) {
                    throw new Error("Error al actualizar el estado de la orden");
                }

                // Simular proceso de 3 segundos
                await new Promise(resolve => setTimeout(resolve, 3000));

                // Redirigir a la página de éxito
                router.push(`/checkout/success/${order.id}`);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Error al procesar el pago",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin">⏳</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Columna Izquierda - Métodos de Pago */}
                    <div className="space-y-8">
                        <Card className="p-6">
                            <h1 className="text-2xl font-bold mb-6">Método de Pago</h1>

                            <div className="space-y-4">
                                <div
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'webpay'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'hover:border-gray-400'
                                        }`}
                                    onClick={() => setSelectedPaymentMethod('webpay')}
                                >
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="h-6 w-6" />
                                        <div>
                                            <p className="font-medium">WebPay</p>
                                            <p className="text-sm text-gray-500">Pago con tarjeta de crédito o débito</p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'transfer'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'hover:border-gray-400'
                                        }`}
                                    onClick={() => setSelectedPaymentMethod('transfer')}
                                >
                                    <div className="flex items-center gap-3">
                                        <Building2 className="h-6 w-6" />
                                        <div>
                                            <p className="font-medium">Transferencia Bancaria</p>
                                            <p className="text-sm text-gray-500">Transferencia directa a nuestra cuenta</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Columna Derecha - Resumen de la Orden */}
                    {order && (
                        <div className="space-y-8">
                            <Card className="p-6">
                                <h2 className="text-xl font-bold mb-6">Resumen de la Orden</h2>

                                <div className="space-y-6">
                                    {/* Detalles del Cliente */}
                                    {order.billing && (
                                        <div className="border-b pb-4">
                                            <h3 className="font-semibold mb-2">Información del Cliente</h3>
                                            <p className="text-sm text-gray-600">
                                                {order.billing.first_name} {order.billing.last_name}
                                            </p>
                                            <p className="text-sm text-gray-600">{order.billing.email}</p>
                                            <p className="text-sm text-gray-600">{order.billing.phone}</p>
                                        </div>
                                    )}

                                    {/* Tours Reservados */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Tours Reservados</h3>
                                        {order.line_items && order.line_items.map((item) => {
                                            const tourDate = item.meta_data?.find(meta => meta.key === 'tour_date')?.value
                                            return (
                                                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                                                    {item.image && (
                                                        <Image
                                                            src={item.image.src}
                                                            alt={item.name}
                                                            width={80}
                                                            height={80}
                                                            className="object-cover rounded-md"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.name}</p>
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-500">
                                                                {item.quantity} {item.quantity === 1 ? 'persona' : 'personas'}
                                                            </p>
                                                            {tourDate && (
                                                                <p className="text-sm text-gray-500">
                                                                    Fecha: {format(parseISO(tourDate), "d 'de' MMMM, yyyy", { locale: es })}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">
                                                            {order.currency_symbol}{Number(item.total).toLocaleString('es-CL')}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Total */}
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">Total</span>
                                            <span className="text-xl font-bold">
                                                {order.currency_symbol}{Number(order.total).toLocaleString('es-CL')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Botones de Acción */}
                                    <div className="space-y-4 pt-4">
                                        <Button
                                            onClick={handlePayment}
                                            disabled={!selectedPaymentMethod}
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            size="lg"
                                        >
                                            <ShoppingCart className="w-5 h-5 mr-2" />
                                            Proceder al Pago
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => router.push('/checkout')}
                                        >
                                            Volver al checkout
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
