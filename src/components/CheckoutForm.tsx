import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CheckoutForm: React.FC = () => {
    const { t } = useTranslation();
    const [paymentError, setPaymentError] = useState('');
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    const handlePayment = async (paymentMethod: string) => {
        try {
            setPaymentProcessing(true);
            setPaymentError('');

            // Save order ID in localStorage for reference after payment flow
            if (orderId) {
                localStorage.setItem('lastOrderId', orderId.toString());
            }

            // Create payment based on selected method
            const response = await createPayment(paymentMethod, orderId);

            if (!response || !response.success) {
                throw new Error(response?.error || 'Payment initialization failed');
            }

            if (!response.paymentUrl) {
                throw new Error('No payment URL returned from the server');
            }

            // Log payment details before redirect
            console.log(`[Checkout] Payment created successfully. Redirecting to ${paymentMethod} payment page`);
            console.log(`[Checkout] Order ID: ${orderId}, Token: ${response.token}`);

            // Redirect to payment processor
            window.location.href = response.paymentUrl;
        } catch (error: any) {
            console.error('[Checkout] Payment error:', error);
            setPaymentProcessing(false);
            setPaymentError(error.message || 'An error occurred during payment processing');

            // Scroll to the error message to make it visible
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 100);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">{t('checkout.title')}</h2>

            {paymentError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-md">
                    <p className="font-medium">Payment Error</p>
                    <p>{paymentError}</p>
                </div>
            )}

            {/* Rest of the form */}
        </div>
    );
};

export default CheckoutForm; 