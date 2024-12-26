'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useReservations } from '@/context/ReservationContext'
import { useRouter } from 'next/navigation'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { countryCodes } from "@/lib/constants/phone-codes"
import { validatePhoneNumber } from '@/lib/libphonenumber';
import { toast as showToast } from "@/hooks/use-toast"
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { SelectCountry } from '@/components/ui/select-country'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
    firstName: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras"),
    lastName: z.string()
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras"),
    email: z.string()
        .email("Email inválido")
        .min(1, "El email es requerido"),
    phone: z.object({
        countryCode: z.string().regex(/^\+\d{1,3}$/, "Formato: +56"),
        number: z.string().min(8, "Número inválido").max(15, "Número demasiado largo")
    }).superRefine((val, ctx) => {
        const country = countryCodes.find(c => c.dial_code === val.countryCode)?.code;
        if (!country) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Código de país inválido",
                path: ["countryCode"]
            });
            return;
        }

        const validation = validatePhoneNumber(val.number, country);
        if (!validation.isValid) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Número inválido. Ejemplo: ${val.countryCode} 912345678`,
                path: ["number"]
            });
        }
    }),
    paymentMethod: z.enum(['webpay', 'paypal']),
    specialRequests: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

export default function CheckoutPage() {
    const router = useRouter()
    const { reservations } = useReservations()
    const [acceptTerms, setAcceptTerms] = useState(false)
    const {
        register,
        watch,
        setValue,
        formState: { errors, },
        handleSubmit,
        getValues
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: {
                countryCode: "+56",
                number: ""
            },
            paymentMethod: "webpay",
            specialRequests: ""
        },
        mode: "all",
        reValidateMode: "onChange"
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFormComplete, setIsFormComplete] = useState(false)
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

    const formValues = watch()

    useEffect(() => {
        const values = getValues()
        const isComplete =
            values.firstName?.trim() !== "" &&
            values.lastName?.trim() !== "" &&
            values.email?.trim() !== "" &&
            values.phone?.number?.trim() !== ""

        setIsFormComplete(isComplete)
    }, [formValues, getValues])

    const total = reservations.reduce((total, item) => total + (item.price * item.quantity), 0)

    const onSubmit = handleSubmit(async (formData: FormData) => {
        console.log('Form Data:', formData);

        if (!acceptTerms) {
            showToast({
                title: "Error",
                description: "Debes aceptar los términos y condiciones"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const country = countryCodes.find(c => c.dial_code === formData.phone.countryCode)?.code || 'CL';

            const orderData = {
                customer: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: `${formData.phone.countryCode}${formData.phone.number}`,
                    country: country
                },
                line_items: reservations.map(reservation => ({
                    product_id: reservation.productId,
                    quantity: reservation.quantity,
                    meta_data: [
                        {
                            key: "tour_date",
                            value: format(parseISO(reservation.date), "d 'de' MMMM, yyyy", { locale: es })
                        }
                    ]
                })),
                meta_data: formData.specialRequests ? [
                    {
                        key: "special_requests",
                        value: formData.specialRequests
                    }
                ] : []
            };

            console.log('Order Data:', orderData);

            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const orderResult = await orderResponse.json();
            console.log('Order Result:', orderResult);

            if (formData.paymentMethod === 'webpay') {
                showToast({
                    title: "Procesando pago",
                    description: "Redirigiendo a WebPay..."
                });

                const paymentResponse = await fetch('/api/payments/flow', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ orderId: orderResult.order.id })
                });

                if (!paymentResponse.ok) {
                    const errorData = await paymentResponse.json();
                    throw new Error(errorData.error || 'Error al procesar el pago');
                }

                const paymentData = await paymentResponse.json();
                console.log('Payment Data:', paymentData);

                if (paymentData.paymentUrl && paymentData.token) {
                    // Redirect to the Flow payment page using the returned paymentUrl and token
                    setRedirectUrl(`${paymentData.paymentUrl}?token=${paymentData.token}`);
                } else {
                    throw new Error('Missing payment URL or token in Flow response.');
                }


                setRedirectUrl(paymentData.paymentUrl + '?token=' + paymentData.token);
            } else {
                // PayPal placeholder
                showToast({
                    title: "Error",
                    description: "PayPal estará disponible próximamente"
                });
            }
        } catch (error) {
            console.error('Error processing order:', error);
            showToast({
                title: "Error",
                description: "No se pudo procesar tu orden. Por favor intenta nuevamente."
            });
        } finally {
            setIsSubmitting(false);
        }
    });

    // Agregar validación para asegurar que hay reservaciones
    useEffect(() => {
        if (reservations.length === 0) {
            showToast({
                title: "No hay reservaciones",
                description: "Por favor selecciona al menos un tour antes de continuar"
            });
            router.push('/');
        }
    }, [reservations, router]);

    useEffect(() => {
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, [redirectUrl]);

    return (
        <form onSubmit={onSubmit} className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-8">Finalizar Compra</h1>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Columna Izquierda - Formulario */}
                    <div className="space-y-8">
                        {/* Información Personal */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Información Personal</h2>

                            <div className="space-y-2">
                                <Label htmlFor="firstName">Nombre*</Label>
                                <Input
                                    id="firstName"
                                    {...register("firstName")}
                                    placeholder="Ingresa tu nombre"
                                    className={cn(
                                        errors.firstName ? "border-red-500" : ""
                                    )}
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Apellido*</Label>
                                <Input
                                    id="lastName"
                                    {...register("lastName")}
                                    placeholder="Ingresa tu apellido"
                                    className={cn(
                                        errors.lastName ? "border-red-500" : ""
                                    )}
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email*</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder="tu@email.com"
                                    className={cn(
                                        errors.email ? "border-red-500" : ""
                                    )}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Número de teléfono*</Label>
                                <div className="flex gap-2">
                                    <div className="w-[120px]">
                                        <SelectCountry
                                            value={watch('phone.countryCode')}
                                            onValueChange={(value) => setValue('phone.countryCode', value)}
                                        />
                                    </div>
                                    <Input
                                        {...register("phone.number")}
                                        placeholder="912345678"
                                        className={cn(
                                            "flex-1",
                                            errors.phone?.number ? "border-red-500" : ""
                                        )}
                                    />
                                </div>
                                {errors.phone?.number && (
                                    <p className="text-sm text-red-500">{errors.phone.number.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialRequests">Solicitudes especiales o comentarios</Label>
                                <Textarea
                                    id="specialRequests"
                                    {...register("specialRequests")}
                                    placeholder="Si tienes alguna solicitud especial o comentario sobre tu visita a Rapa Nui, escríbelo aquí"
                                />
                            </div>
                        </div>

                        {/* Términos y Condiciones */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={acceptTerms}
                                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                                />
                                <Label htmlFor="terms" className="text-sm">
                                    Acepto las condiciones del servicio y la política de reembolsos
                                </Label>
                            </div>
                            <p className="text-sm text-gray-500">
                                Al marcar esta casilla, confirmas que has leído y aceptas nuestras
                                <a href="#" className="text-blue-600 hover:underline"> condiciones del servicio</a> y
                                <a href="#" className="text-blue-600 hover:underline"> política de reembolsos</a> específicas para tours y rentals.
                            </p>
                        </div>

                        {/* Agregar sección de métodos de pago antes del botón de confirmar */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Método de Pago</h2>
                            <RadioGroup
                                defaultValue="webpay"
                                onValueChange={(value) => setValue('paymentMethod', value as 'webpay' | 'paypal')}
                            >
                                <Card className="cursor-pointer relative">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <RadioGroupItem value="webpay" id="webpay" />
                                        <Image
                                            src="/logos/webpay.png"
                                            alt="WebPay"
                                            width={80}
                                            height={40}
                                            className="object-contain"
                                        />
                                        <div>
                                            <Label htmlFor="webpay">WebPay Plus</Label>
                                            <p className="text-sm text-gray-500">Paga con tarjetas de débito y crédito chilenas</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer relative opacity-50">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <RadioGroupItem value="paypal" id="paypal" disabled />
                                        <Image
                                            src="/logos/paypal.png"
                                            alt="PayPal"
                                            width={80}
                                            height={40}
                                            className="object-contain h-auto w-[90px]"
                                        />
                                        <div>
                                            <Label htmlFor="paypal">PayPal</Label>
                                            <p className="text-sm text-gray-500">Próximamente disponible</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </RadioGroup>
                        </div>
                    </div>

                    {/* Columna Derecha - Resumen de la Reserva */}
                    <div className="space-y-8">
                        {/* Tours Reservados */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Tours Reservados en Rapa Nui</h2>
                            {reservations.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        className="object-cover rounded-md"
                                    />
                                    <div className="flex-1 space-y-2">
                                        <p className="font-medium">{item.name}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500">
                                                    {item.quantity} {item.quantity === 1 ? 'persona' : 'personas'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Fecha: {format(parseISO(item.date), "d 'de' MMMM, yyyy", { locale: es })}
                                                </p>
                                            </div>
                                            <span className="font-semibold">
                                                ${(item.price * item.quantity).toLocaleString('es-CL')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen del Pedido */}
                        <div className="border rounded-lg p-6 space-y-4">
                            <h2 className="text-xl font-semibold">Resumen de la Reserva</h2>

                            <div className="space-y-2">
                                <div className="flex justify-between pt-4 font-semibold">
                                    <span>Total</span>
                                    <span>${total.toLocaleString('es-CL')}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    * impuestos incluidos
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                size="lg"
                                disabled={!isFormComplete || !acceptTerms || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <span className="animate-spin">⏳</span>
                                        Procesando Pago...
                                    </div>
                                ) : (
                                    "Pagar Ahora"
                                )}
                            </Button>

                            <div className="text-center">
                                <Button variant="link" className="text-blue-600 border w-full py-4 hover:border-blue-600 hover:no-underline" onClick={() => router.push('/')}>
                                    Continuar Explorando Hotumatur
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Debug section actualizado */}
            {/* {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
                    <p className="font-bold mb-2">Debug:</p>
                    <div className="space-y-1">
                        <p>Form Complete: {isFormComplete ? 'Sí' : 'No'}</p>
                        <p>Terms Accepted: {acceptTerms ? 'Sí' : 'No'}</p>
                        <p>Is Submitting: {isSubmitting ? 'Sí' : 'No'}</p>
                        <p>Reservations: {reservations.length}</p>
                        <div className="mt-2">
                            <p className="font-semibold">Form Values:</p>
                            <pre className="text-xs bg-white p-2 rounded mt-1">
                                {JSON.stringify({
                                    firstName: watch('firstName'),
                                    lastName: watch('lastName'),
                                    email: watch('email'),
                                    phone: watch('phone'),
                                    specialRequests: watch('specialRequests')
                                }, null, 2)}
                            </pre>
                        </div>
                        <div className="mt-2">
                            <p className="font-semibold">Reservations:</p>
                            <pre className="text-xs bg-white p-2 rounded mt-1">
                                {JSON.stringify(reservations, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )} */}
        </form>
    );
}