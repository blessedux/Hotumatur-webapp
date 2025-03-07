import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function PayPalTest() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Mock order data for testing
    const testOrderData = {
        customer: {
            first_name: "Test",
            last_name: "User",
            email: "test@example.com",
            phone: "+1234567890",
            country: "CL"
        },
        line_items: [
            {
                product_id: 123, // Replace with an actual product ID from your WooCommerce
                quantity: 1,
                meta_data: [
                    {
                        key: "test_item",
                        value: "Test Tour"
                    }
                ]
            }
        ]
    };

    const handleTestPayment = async () => {
        try {
            setLoading(true);

            // Step 1: Create WooCommerce Order
            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testOrderData)
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const { order } = await orderResponse.json();
            console.log('Created order:', order);

            // Step 2: Create PayPal Payment
            const paypalResponse = await fetch('/api/payments/paypal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId: order.id })
            });

            if (!paypalResponse.ok) {
                throw new Error('Failed to create PayPal payment');
            }

            const paypalData = await paypalResponse.json();
            console.log('PayPal payment created:', paypalData);

            // Step 3: Redirect to PayPal
            if (paypalData.paymentUrl) {
                window.location.href = paypalData.paymentUrl;
            } else {
                throw new Error('No payment URL received');
            }

        } catch (error: any) {
            console.error('Payment test error:', error);
            toast({
                title: "Error",
                description: error.message || 'Something went wrong',
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">PayPal Payment Test</h2>
            <Button
                onClick={handleTestPayment}
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Test PayPal Payment'}
            </Button>
        </div>
    );
} 