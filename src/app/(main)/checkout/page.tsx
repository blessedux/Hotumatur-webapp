'use client';

import { useEffect, useState, useCallback } from 'react';
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
    const [errorDetails, setErrorDetails] = useState<any>(null);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'flow' | 'paypal'>('flow');
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    // Translations
    const preparingCheckoutText = useDirectTranslation(
        "Preparing your checkout...",
        "Preparando tu pago..."
    );

    const processingPaymentText = useDirectTranslation(
        "Processing your payment...",
        "Procesando tu pago..."
    );

    const noReservationsText = useDirectTranslation(
        "You don't have any reservations to checkout",
        "No tienes reservas para procesar"
    );

    const errorText = useDirectTranslation(
        "There was an error processing your payment",
        "Hubo un error procesando tu pago"
    );

    const paymentErrorText = useDirectTranslation(
        "Payment error",
        "Error de pago"
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

        // Set a timeout to make sure we don't hang forever on errors
        const timeout = setTimeout(() => {
            if (isProcessing) {
                console.error('Payment processing timeout - taking too long');
                setError('Payment processing timeout - please try again');
                setIsProcessing(false);
                toast({
                    title: errorText,
                    description: 'The payment process is taking too long. Please try again.',
                    variant: "destructive"
                });
            }
        }, 30000); // 30 second timeout

        setTimeoutId(timeout);

        return () => {
            // Clear timeout on unmount
            if (timeout) clearTimeout(timeout);
        };
    }, [router, toast, errorText]);

    // Debug log for reservations changes
    useEffect(() => {
        if (isClient) {
            console.log('Checkout page - Current reservations:', reservations);
        }
    }, [reservations, isClient]);

    // Process the payment - defined as a callback so we can call it again on retry
    const processPayment = useCallback(async () => {
        // Reset error state
        setError(null);
        setErrorDetails(null);

        try {
            setIsProcessing(true);
            console.log('Processing payment for reservations:', reservations);
            console.log('Using payment method:', selectedPaymentMethod);

            if (!customerInfo) {
                throw new Error('No customer information available');
            }

            if (reservations.length === 0) {
                throw new Error('No reservations to process');
            }

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
                let errorData;
                try {
                    errorData = await orderResponse.json();
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
                let errorData;
                try {
                    errorData = await paymentResponse.json();
                    console.error(`${paymentGateway.toUpperCase()} payment creation failed:`, paymentResponse.status, errorData);
                    errorMessage += ` - ${JSON.stringify(errorData)}`;
                    setErrorDetails(errorData);
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

                // Update UI to show we're redirecting
                toast({
                    title: "Redirecting to payment processor",
                    description: "Please wait while we redirect you to the payment page...",
                });

                // Clean up customer info from session storage
                sessionStorage.removeItem('hotumatur_customer_info');

                // Clear the timeout since we're about to redirect
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                // Save orderId in localStorage for reference after payment flow
                if (order && order.id) {
                    localStorage.setItem('lastOrderId', order.id.toString());
                }

                // Short delay to allow the toast to show before redirecting
                setTimeout(() => {
                    // Redirect to payment page
                    window.location.href = paymentData.paymentUrl;
                }, 1000);
            } else {
                throw new Error('No payment URL received');
            }

        } catch (error: any) {
            console.error('Payment processing error:', error);
            setError(error.message || 'Unknown error occurred');
            setIsProcessing(false);

            // Extract more detailed error information if available
            let errorMsg = error.message || 'Unknown error occurred';

            if (typeof errorDetails === 'object' && errorDetails !== null) {
                if (errorDetails.error) errorMsg = errorDetails.error;
                if (errorDetails.message) errorMsg += `: ${errorDetails.message}`;
                if (errorDetails.details) {
                    console.error('Error details:', errorDetails.details);

                    // For Flow-specific errors, check for API error messages
                    if (typeof errorDetails.details === 'string' && errorDetails.details.includes('Flow API error')) {
                        errorMsg = errorDetails.details;
                    }
                }
            }

            toast({
                title: paymentErrorText,
                description: errorMsg,
                variant: "destructive"
            });
        }
    }, [reservations, customerInfo, selectedPaymentMethod, timeoutId, toast, paymentErrorText]);

    // Start payment processing when we have all the required data
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

        // Skip if we already have an error
        if (error) return;

        // Start payment processing with a small delay to ensure reservations are loaded
        const timer = setTimeout(() => {
            processPayment();
        }, 500);

        return () => clearTimeout(timer);
    }, [reservations, isClient, isProcessing, customerInfo, error, processPayment]);

    // Handle retry
    const handleRetry = () => {
        processPayment();
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

    // Show error state - simplified version without Alert component
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center mt-20 min-h-[60vh] px-4">
                <div className="w-full max-w-2xl">
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        <h3 className="text-lg font-semibold mb-2">{paymentErrorText}</h3>
                        <p>{error}</p>
                    </div>

                    {errorDetails && (
                        <div className="text-sm text-gray-500 mb-6">
                            <details>
                                <summary className="cursor-pointer font-medium">Technical Details</summary>
                                <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-40 p-2 bg-gray-100 rounded">
                                    {JSON.stringify(errorDetails, null, 2)}
                                </pre>
                            </details>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                        <Button onClick={handleRetry} className="mb-2 sm:mb-0">
                            {tryAgainText}
                        </Button>
                        <Button onClick={handleBackToForm} variant="outline" className="mb-2 sm:mb-0">
                            {backToFormText}
                        </Button>
                        <Button onClick={handleGoBack} variant="ghost">
                            {backToHomeText}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // No reservations
    if (reservations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-40 min-h-[60vh]">
                <h2 className="text-xl font-bold mb-4">{noReservationsText}</h2>
                <Button onClick={handleGoBack}>
                    {backToHomeText}
                </Button>
            </div>
        );
    }

    // Processing payment
    return (
        <div className="flex flex-col items-center justify-center mt-40 min-h-[60vh]">
            <LoadingSpinner />
            <p className="mt-4 text-lg">{processingPaymentText}</p>
            <p className="mt-2 text-sm text-gray-500">
                {selectedPaymentMethod === 'flow' ? 'Flow' : 'PayPal'}
            </p>
        </div>
    );
} 