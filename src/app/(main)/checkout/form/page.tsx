'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReservations } from '@/context/ReservationContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { useDirectTranslation } from '@/hooks/useTranslatedText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';

interface CustomerInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    preferredLanguage: 'en' | 'es';
    paymentMethod: 'flow' | 'paypal';
}

export default function CheckoutFormPage() {
    const router = useRouter();
    const { reservations } = useReservations();
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { i18n } = useTranslation();

    // Form state
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: 'CL',
        preferredLanguage: i18n.language as 'en' | 'es', // Default to current language
        paymentMethod: 'flow', // Default to Flow for Chilean customers
    });

    // Form validation
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Translations
    const checkoutTitleText = useDirectTranslation(
        "Checkout",
        "Confirmación de Reserva"
    );

    const yourReservationsText = useDirectTranslation(
        "Your Reservations",
        "Tus Reservas"
    );

    const customerInfoText = useDirectTranslation(
        "Customer Information",
        "Información del Cliente"
    );

    const firstNameText = useDirectTranslation(
        "First Name",
        "Nombre"
    );

    const lastNameText = useDirectTranslation(
        "Last Name",
        "Apellido"
    );

    const emailText = useDirectTranslation(
        "Email",
        "Correo Electrónico"
    );

    const phoneText = useDirectTranslation(
        "Phone Number",
        "Número de Teléfono"
    );

    const countryText = useDirectTranslation(
        "Country",
        "País"
    );

    const preferredLanguageText = useDirectTranslation(
        "Preferred Tour Language",
        "Idioma Preferido para el Tour"
    );

    const englishText = useDirectTranslation(
        "English",
        "Inglés"
    );

    const spanishText = useDirectTranslation(
        "Spanish",
        "Español"
    );

    const bilingualDisclaimerText = useDirectTranslation(
        "Most of our tours are bilingual (English and Spanish). Your preference will help us with tour planning.",
        "La mayoría de nuestros tours son bilingües (Inglés y Español). Tu preferencia nos ayudará a planificar mejor el tour."
    );

    const paymentMethodText = useDirectTranslation(
        "Choose Payment Method",
        "Elige el Método de Pago"
    );

    const proceedWithFlowText = useDirectTranslation(
        "Proceed with Flow",
        "Continuar con Flow"
    );

    const proceedWithPaypalText = useDirectTranslation(
        "Proceed with PayPal",
        "Continuar con PayPal"
    );

    const selectPaymentText = useDirectTranslation(
        "Please select a payment method",
        "Por favor selecciona un método de pago"
    );

    const proceedToPaymentText = useDirectTranslation(
        "Proceed to Payment",
        "Proceder al Pago"
    );

    const backText = useDirectTranslation(
        "Back",
        "Volver"
    );

    const forText = useDirectTranslation(
        "for",
        "para"
    );

    const personText = useDirectTranslation(
        "person",
        "persona"
    );

    const peopleText = useDirectTranslation(
        "people",
        "personas"
    );

    const dateText = useDirectTranslation(
        "Date",
        "Fecha"
    );

    const totalText = useDirectTranslation(
        "Total",
        "Total"
    );

    const requiredFieldText = useDirectTranslation(
        "This field is required",
        "Este campo es obligatorio"
    );

    const invalidEmailText = useDirectTranslation(
        "Invalid email address",
        "Correo electrónico inválido"
    );

    const noReservationsText = useDirectTranslation(
        "You don't have any reservations to checkout",
        "No tienes reservas para procesar"
    );

    const reviewOrderText = useDirectTranslation(
        "Review Your Order",
        "Revisa tu Orden"
    );

    // Set isClient to true once component mounts
    useEffect(() => {
        setIsClient(true);
        console.log('Checkout form page mounted');
    }, []);

    // Debug log for reservations
    useEffect(() => {
        if (isClient) {
            console.log('Checkout form - Current reservations:', reservations);
        }
    }, [reservations, isClient]);

    // Get the appropriate date locale based on language
    const dateLocale = i18n.language === 'en' ? enUS : es;

    // Date format pattern based on language
    const dateFormatPattern = i18n.language === 'en' ? "MMMM d, yyyy" : "d 'de' MMMM, yyyy";

    // Calculate total
    const calculateTotal = () => {
        return reservations.reduce((total, reservation) => {
            const price = Number(reservation.price) || 0;
            const quantity = Number(reservation.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle radio group changes for language
    const handleLanguageChange = (value: 'en' | 'es') => {
        setCustomerInfo(prev => ({
            ...prev,
            preferredLanguage: value
        }));
    };

    // Handle radio group changes for payment method
    const handlePaymentMethodChange = (value: 'flow' | 'paypal') => {
        setCustomerInfo(prev => ({
            ...prev,
            paymentMethod: value
        }));
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!customerInfo.firstName.trim()) {
            newErrors.firstName = requiredFieldText;
        }

        if (!customerInfo.lastName.trim()) {
            newErrors.lastName = requiredFieldText;
        }

        if (!customerInfo.email.trim()) {
            newErrors.email = requiredFieldText;
        } else if (!/^\S+@\S+\.\S+$/.test(customerInfo.email)) {
            newErrors.email = invalidEmailText;
        }

        if (!customerInfo.phone.trim()) {
            newErrors.phone = requiredFieldText;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: "Form Validation Error",
                description: "Please complete all required fields correctly",
                variant: "destructive"
            });
            return;
        }

        if (!customerInfo.paymentMethod) {
            toast({
                title: "Payment Method Required",
                description: selectPaymentText,
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare order data with form information
            const orderData = {
                customer: {
                    first_name: customerInfo.firstName,
                    last_name: customerInfo.lastName,
                    email: customerInfo.email,
                    phone: customerInfo.phone,
                    country: customerInfo.country,
                    meta_data: [
                        {
                            key: "preferred_language",
                            value: customerInfo.preferredLanguage
                        },
                        {
                            key: "payment_method",
                            value: customerInfo.paymentMethod
                        }
                    ]
                },
                line_items: reservations.map(reservation => ({
                    product_id: reservation.productId,
                    quantity: reservation.quantity,
                    meta_data: [
                        {
                            key: "date",
                            value: reservation.date
                        }
                    ]
                }))
            };

            console.log('Submitting order with data:', orderData);

            // Save customer information in session storage
            try {
                sessionStorage.setItem('hotumatur_customer_info', JSON.stringify(orderData.customer));
                console.log('Saved customer info to session storage');
            } catch (storageError) {
                console.error('Error saving to session storage:', storageError);
            }

            // Navigate to the payment processing page
            router.push('/checkout');

        } catch (error) {
            console.error('Error submitting form:', error);
            toast({
                title: "Error",
                description: "There was an error processing your information. Please try again.",
                variant: "destructive"
            });
            setIsSubmitting(false);
        }
    };

    // Function to proceed with a specific payment method
    const handlePaymentMethodSelection = (method: 'flow' | 'paypal') => {
        setCustomerInfo(prev => ({
            ...prev,
            paymentMethod: method
        }));

        // Submit form with the selected payment method
        const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
        handleSubmit(fakeEvent);
    };

    // Handle going back
    const handleGoBack = () => {
        router.back();
    };

    // Show loading during server-side rendering
    if (!isClient) {
        return (
            <div className="flex flex-col items-center justify-center mt-40 min-h-[60vh]">
                <LoadingSpinner />
                <p className="mt-4 text-lg">{checkoutTitleText}</p>
            </div>
        );
    }

    // Show message if no reservations
    if (reservations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-40 min-h-[60vh]">
                <p className="text-lg mb-6">{noReservationsText}</p>
                <Button
                    onClick={() => router.push('/')}
                    className="bg-hotumatur-primary hover:bg-hotumatur-primary/90"
                >
                    {backText}
                </Button>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8 mt-40">
            <h1 className="text-3xl font-bold mb-8 text-center">{checkoutTitleText}</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left column: Order summary */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">{reviewOrderText}</h2>
                    <Card className="p-4">
                        <h3 className="font-semibold mb-3">{yourReservationsText}</h3>
                        <div className="space-y-4 mb-6">
                            {reservations.map((reservation) => (
                                <div key={reservation.id} className="border-b pb-3">
                                    <p className="font-medium">{reservation.name}</p>
                                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                                        <div>
                                            <p>{forText} {reservation.quantity} {reservation.quantity === 1 ? personText : peopleText}</p>
                                            <p>{dateText}: {format(parseISO(reservation.date), dateFormatPattern, { locale: dateLocale })}</p>
                                        </div>
                                        <p className="font-medium">
                                            ${((Number(reservation.price) || 0) * reservation.quantity).toLocaleString(i18n.language === 'en' ? 'en-US' : 'es-CL')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                            <span className="font-semibold">{totalText}:</span>
                            <span className="font-bold text-lg">
                                ${calculateTotal().toLocaleString(i18n.language === 'en' ? 'en-US' : 'es-CL')}
                            </span>
                        </div>
                    </Card>
                </div>

                {/* Right column: Customer form */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">{customerInfoText}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="firstName">{firstNameText}</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={customerInfo.firstName}
                                onChange={handleInputChange}
                                className={errors.firstName ? "border-red-500" : ""}
                            />
                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>

                        <div>
                            <Label htmlFor="lastName">{lastNameText}</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={customerInfo.lastName}
                                onChange={handleInputChange}
                                className={errors.lastName ? "border-red-500" : ""}
                            />
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>

                        <div>
                            <Label htmlFor="email">{emailText}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={customerInfo.email}
                                onChange={handleInputChange}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <Label htmlFor="phone">{phoneText}</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={customerInfo.phone}
                                onChange={handleInputChange}
                                className={errors.phone ? "border-red-500" : ""}
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <Label htmlFor="country">{countryText}</Label>
                            <Input
                                id="country"
                                name="country"
                                value={customerInfo.country}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Language preference selection */}
                        <div className="pt-2">
                            <Label>{preferredLanguageText}</Label>
                            <RadioGroup
                                value={customerInfo.preferredLanguage}
                                onValueChange={(value: 'en' | 'es') => handleLanguageChange(value)}
                                className="flex space-x-4 mt-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="en" id="en" />
                                    <Label htmlFor="en" className="cursor-pointer">{englishText}</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="es" id="es" />
                                    <Label htmlFor="es" className="cursor-pointer">{spanishText}</Label>
                                </div>
                            </RadioGroup>
                            <p className="text-sm text-gray-500 mt-2 italic">{bilingualDisclaimerText}</p>
                        </div>

                        {/* Payment method selection - Updated to buttons with logos */}
                        <div className="pt-4 border-t mt-4">
                            <Label className="text-lg font-medium mb-3 block">{paymentMethodText}</Label>
                            <div className="flex flex-col gap-4">
                                <Button
                                    type="button"
                                    onClick={() => handlePaymentMethodSelection('flow')}
                                    disabled={isSubmitting}
                                    className="bg-purple-600 hover:bg-purple-700 p-6 h-auto flex items-center justify-center gap-3"
                                >
                                    <Image
                                        src="/logos/webpay.png"
                                        alt="WebPay Logo"
                                        width={80}
                                        height={30}
                                        className="object-contain"
                                    />
                                    <span>{proceedWithFlowText}</span>
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => handlePaymentMethodSelection('paypal')}
                                    disabled={isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700 p-6 h-auto flex items-center justify-center gap-3"
                                >
                                    <Image
                                        src="/logos/paypal.png"
                                        alt="PayPal Logo"
                                        width={80}
                                        height={30}
                                        className="object-contain"
                                    />
                                    <span>{proceedWithPaypalText}</span>
                                </Button>
                            </div>
                            {isSubmitting && (
                                <div className="flex justify-center mt-4">
                                    <LoadingSpinner />
                                    <span className="ml-2">{proceedToPaymentText}...</span>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 