import { NextResponse } from 'next/server';
import { flowService } from '@/services/server/flow.service';
import { config } from '@/config';
import axios from 'axios';

export async function GET() {
    // Check required configuration
    if (!config.flow.apiKey || !config.flow.secretKey || !config.flow.apiUrl) {
        return NextResponse.json(
            {
                error: 'Flow configuration is incomplete. Please check your environment variables.',
            },
            { status: 500 }
        );
    }

    const results: any = {
        environment: {
            appUrl: config.app.appUrl,
            flowApiUrl: config.flow.apiUrl,
            hasApiKey: !!config.flow.apiKey,
            hasSecretKey: !!config.flow.secretKey,
        },
        steps: {},
    };

    try {
        // Step 1: Check basic info - we'll just log the environment config
        results.steps.basicInfo = {
            success: true,
            message: "Environment configuration available"
        };

        // Step 2: Test signature generation
        console.log('\nStep 2: Testing signature generation...');
        try {
            const signature = await flowService.generateSignature({
                apiKey: config.flow.apiKey,
                secretKey: config.flow.secretKey,
            });
            console.log('Generated signature:', signature);
            results.steps.signatureGeneration = {
                success: signature.length === 64,
                signatureLength: signature.length,
            };
        } catch (error: any) {
            console.error('Signature generation error:', error);
            results.steps.signatureGeneration = {
                success: false,
                error: error.message,
            };
        }

        // Step 3: Test payment creation with simplified parameters
        console.log('\nStep 3: Testing payment creation...');
        try {
            // Generate a unique order ID
            const commerceOrder = 'TEST_' + Date.now();
            console.log('Test parameters:', {
                commerceOrder,
                subject: 'Pago de prueba',
                amount: 1000
            });

            const paymentResult = await flowService.createPayment({
                commerceOrder,
                subject: 'Pago de prueba',
                amount: 1000,
                email: "test@hotumatur.cl", // Will be normalized in the service
                urlConfirmation: `${config.app.appUrl}/api/payments/flow/confirm`,
                urlReturn: `${config.app.appUrl}/api/payments/flow/return`,
                paymentMethod: 9, // All payment methods
                optional: {
                    rut: '9999999-9',
                },
            });

            console.log('Payment creation result:', paymentResult);
            results.steps.paymentCreation = {
                success: !!paymentResult.url && !!paymentResult.token,
                result: paymentResult,
            };
        } catch (error: any) {
            console.error('Payment creation error:', error.response?.data || error);
            results.steps.paymentCreation = {
                success: false,
                error: error.response?.data?.message || error.message,
            };
        }

        // Step 4: Test confirmation URL
        console.log('\nStep 4: Testing confirmation URL...');
        try {
            const confirmUrl = `${config.app.appUrl}/api/payments/flow/confirm`;
            console.log('Testing confirmation URL:', confirmUrl);
            const confirmResponse = await axios.post(confirmUrl);
            console.log('Confirmation URL response:', confirmResponse.data);
            results.steps.confirmUrlTest = {
                success: confirmResponse.status === 200,
                status: confirmResponse.status,
                data: confirmResponse.data
            };
        } catch (error: any) {
            console.error('Confirmation URL error:', error.response?.data || error);
            results.steps.confirmUrlTest = {
                success: false,
                error: error.message,
            };
        }

        // Step 5: Test return URL
        console.log('\nStep 5: Testing return URL...');
        try {
            const returnUrl = `${config.app.appUrl}/api/payments/flow/return`;
            console.log('Testing return URL:', returnUrl);
            const returnResponse = await axios.get(returnUrl);
            console.log('Return URL response:', returnResponse.data);
            results.steps.returnUrlTest = {
                success: returnResponse.status === 200,
                status: returnResponse.status,
                data: returnResponse.data
            };
        } catch (error: any) {
            console.error('Return URL error:', error.response?.data || error);
            results.steps.returnUrlTest = {
                success: false,
                error: error.message,
            };
        }

        console.log('\nAll tests completed');
        return NextResponse.json(results);
    } catch (error: any) {
        console.error('Test process error:', error);
        return NextResponse.json(
            {
                error: error.message,
                results,
            },
            { status: 500 }
        );
    }
} 