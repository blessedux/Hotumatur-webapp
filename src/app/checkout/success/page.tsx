'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orderInfo, setOrderInfo] = useState({
        orderId: '',
        provider: '',
        status: 'success'
    });

    useEffect(() => {
        const orderId = searchParams.get('orderId') || localStorage.getItem('lastOrderId') || '';
        const provider = searchParams.get('provider') || '';
        const status = searchParams.get('status') || 'success';

        setOrderInfo({
            orderId,
            provider,
            status
        });

        // Clean up localStorage (for security)
        setTimeout(() => {
            localStorage.removeItem('lastOrderId');
            localStorage.removeItem('cart');
        }, 1000);
    }, [searchParams]);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('paymentSuccess')}</h1>
                    <p className="text-gray-600 mt-2">{t('orderConfirmed')}</p>
                </div>

                {orderInfo.orderId && (
                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                        <p className="text-gray-700">
                            <span className="font-medium">{t('orderNumber')}:</span> #{orderInfo.orderId}
                        </p>
                        {orderInfo.provider && (
                            <p className="text-gray-700">
                                <span className="font-medium">{t('paymentMethod')}:</span> {orderInfo.provider.toUpperCase()}
                            </p>
                        )}
                    </div>
                )}

                <div className="text-gray-700 mb-8">
                    <p>{t('thankYouMessage')}</p>
                    <p className="mt-3">{t('confirmationEmail')}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        {t('backToHome')}
                    </Link>
                    <Link
                        href="/messages"
                        className="inline-flex justify-center items-center px-6 py-3 border border-teal-600 text-base font-medium rounded-md text-teal-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        {t('contactUs')}
                    </Link>
                </div>
            </div>
        </div>
    );
} 