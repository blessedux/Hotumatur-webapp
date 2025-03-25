'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReservations } from '@/context/ReservationContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { useDirectTranslation } from '@/hooks/useTranslatedText';
import { Button } from '@/components/ui/button';

interface CustomerInfo {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country: string;
    meta_data?: Array<{
        key: string;
        value: string;
    }>;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { reservations, clearReservations } = useReservations();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'flow' | 'paypal'>('flow');

    // Translations
    const preparingCheckoutText = useDirectTranslation(
        "Preparing your checkout...",
        "Preparando tu pago..."
    );

    const noReservationsText = useDirectTranslation(
        "You don't have any reservations to checkout",
        "No tienes reservas para procesar"
    );

    const errorText = useDirectTranslation(
        "There was an error processing your payment",
        "Hubo un error procesando tu pago"
    );

    const tryAgainText = useDirectTranslation(
        "Try Again",
        "Intentar Nuevamente"
    );

    const backToHomeText = useDirectTranslation(
        "Back to Home",
        "Volver al Inicio"
    );

    const backToFormText = useDirectTranslation(
        "Back to Form",
        "Volver al Formulario"
    );

    // Set isClient to true once component mounts and get customerInfo
    useEffect(() => {
        setIsClient(true);

        // Attempt to get customer info from session storage
        try {
            const storedCustomerInfo = sessionStorage.getItem('hotumatur_customer_info');
            if (storedCustomerInfo) {
                const parsedInfo = JSON.parse(storedCustomerInfo);
                setCustomerInfo(parsedInfo);
                console.log('Retrieved customer info from storage:', parsedInfo);

                // Extract payment method from meta_data if available
                if (parsedInfo.meta_data && Array.isArray(parsedInfo.meta_data)) {
                    const paymentMethodData = parsedInfo.meta_data.find((item: { key: string; value: string }) => item.key === 'payment_method');
                    if (paymentMethodData && (paymentMethodData.value === 'flow' || paymentMethodData.value === 'paypal')) {
                        setSelectedPaymentMethod(paymentMethodData.value);
                        console.log('Payment method selected:', paymentMethodData.value);
                    }
                }
            } else {
                console.log('No customer info found in storage, redirecting to form');
                // If no customer info, redirect to the form
                router.push('/checkout/form');
            }
        } catch (error) {
            console.error('Error retrieving customer info from storage:', error);
        }

        // Debug log for initial render
        console.log('Checkout page mounted');
    }, [router]);

    // Debug log for reservations changes
    useEffect(() => {
        if (isClient) {
            console.log('Checkout page - Current reservations:', reservations);
        }
    }, [reservations, isClient]);

    // Process the payment when the component mounts and has customer info
    useEffect(() => {
        // Only run on client-side and when we have customer info
        if (!isClient || !customerInfo) return;

        // Skip if already processing
        if (isProcessing) return;

        // Skip if no reservations
        if (reservations.length === 0) {
            console.log('No reservations to process');
            return;
        }

        const processPayment = async () => {
            try {
                setIsProcessing(true);
                setError(null);
                console.log('Processing payment for reservations:', reservations);
                console.log('Using payment method:', selectedPaymentMethod);

                // Create an order with the reservations and customer info
                const orderData = {
                    customer: customerInfo,
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

                console.log('Creating order with data:', orderData);

                // Create the order
                const orderResponse = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });

                // Handle non-200 responses with detailed error logging
                if (!orderResponse.ok) {
                    let errorMessage = `Failed to create order: ${orderResponse.status}`;
                    try {
                        const errorData = await orderResponse.json();
                        console.error('Order creation failed:', orderResponse.status, errorData);
                        errorMessage += ` - ${JSON.stringify(errorData)}`;
                    } catch (e) {
                        console.error('Could not parse error response');
                    }
                    throw new Error(errorMessage);
                }

                const { order } = await orderResponse.json();
                console.log('Created order:', order);

                // Determine payment gateway based on selected payment method
                const paymentGateway = selectedPaymentMethod === 'flow' ? 'flow' : 'paypal';

                // Create payment (Flow or PayPal)
                const paymentResponse = await fetch(`/api/payments/${paymentGateway}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ orderId: order.id })
                });

                // Handle non-200 responses with detailed error logging
                if (!paymentResponse.ok) {
                    let errorMessage = `Failed to create ${paymentGateway} payment: ${paymentResponse.status}`;
                    try {
                        const errorData = await paymentResponse.json();
                        console.error(`${paymentGateway.toUpperCase()} payment creation failed:`, paymentResponse.status, errorData);
                        errorMessage += ` - ${JSON.stringify(errorData)}`;
                    } catch (e) {
                        console.error('Could not parse error response');
                    }
                    throw new Error(errorMessage);
                }

                const paymentData = await paymentResponse.json();
                console.log(`${paymentGateway.toUpperCase()} payment created:`, paymentData);

                // Redirect to payment gateway
                if (paymentData.paymentUrl) {
                    console.log('Redirecting to payment URL:', paymentData.paymentUrl);

                    // Clean up customer info from session storage
                    sessionStorage.removeItem('hotumatur_customer_info');

                    // Redirect to payment page
                    window.location.href = paymentData.paymentUrl;
                } else {
                    throw new Error('No payment URL received');
                }

            } catch (error: any) {
                console.error('Payment processing error:', error);
                setError(error.message || 'Unknown error occurred');
                toast({
                    title: errorText,
                    description: error.message || 'Something went wrong with the payment process',
                    variant: "destructive"
                });
                setIsProcessing(false);
            }
        };

        // Start payment processing with a small delay to ensure reservations are loaded
        const timer = setTimeout(() => {
            processPayment();
        }, 500);

        return () => clearTimeout(timer);
    }, [reservations, toast, isClient, isProcessing, errorText, clearReservations, customerInfo, selectedPaymentMethod]);

    // Handle retry
    const handleRetry = () => {
        setIsProcessing(false); // Reset processing state to trigger the effect again
    };

    // Handle go back to form
    const handleBackToForm = () => {
        router.push('/checkout/form');
    };

    // Handle go back
    const handleGoBack = () => {
        router.push('/');
    };

    // Show a loading state during server-side rendering
    if (!isClient) {
        return (
            <div className="flex flex-col items-center justify-center mt-40 min-h-[60vh]">
                <LoadingSpinner />
                <p className="mt-4 text-lg">{preparingCheckoutText}</p>
            </div>
        );
    }

    // Show error state if there was an error
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center mt-40 min-h-[60vh]">
                <div className="text-red-500 text-xl mb-4">{errorText}</div>
                <p className="mb-6">{error}</p>
                <div className="flex gap-4">
                    <Button
                        onClick={handleRetry}
                        className="bg-hotumatur-primary hover:bg-hotumatur-primary/90"
                    >
                        {tryAgainText}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleBackToForm}
                    >
                        {backToFormText}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleGoBack}
                    >
                        {backToHomeText}
                    </Button>
                </div>
            </div>
        );
    }

    // Client-side rendering - no reservations
    if (reservations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-40 min-h-[60vh]">
                <p className="text-lg mb-6">{noReservationsText}</p>
                <Button
                    onClick={handleGoBack}
                    className="bg-hotumatur-primary hover:bg-hotumatur-primary/90"
                >
                    {backToHomeText}
                </Button>
            </div>
        );
    }

    // Processing state
    return (
        <div className="flex flex-col items-center justify-center mt-40 min-h-[60vh]">
            <LoadingSpinner />
            <p className="mt-4 text-lg">{preparingCheckoutText}</p>
            <p className="mt-2 text-sm text-gray-500">Processing {reservations.length} item(s)...</p>
            {customerInfo && (
                <div className="mt-2 text-center">
                    <p className="text-sm text-gray-500">
                        Order for: {customerInfo.first_name} {customerInfo.last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                        Payment method: {selectedPaymentMethod === 'flow' ? 'Flow (CLP)' : 'PayPal (USD)'}
                    </p>
                </div>
            )}
        </div>
    );
} 