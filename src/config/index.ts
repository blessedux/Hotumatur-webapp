const requiredEnvs = {
    NEXT_PUBLIC_WC_API_URL: process.env.NEXT_PUBLIC_WC_API_URL,
    WC_CONSUMER_KEY: process.env.WC_CONSUMER_KEY,
    WC_CONSUMER_SECRET: process.env.WC_CONSUMER_SECRET
} as const;

Object.entries(requiredEnvs).forEach(([key, value]) => {
    if (!value) {
        throw new Error(`Environment variable ${key} is missing`);
    }
});

export const config = {
    woocommerce: {
        url: requiredEnvs.NEXT_PUBLIC_WC_API_URL,
        consumerKey: requiredEnvs.WC_CONSUMER_KEY,
        consumerSecret: requiredEnvs.WC_CONSUMER_SECRET
    }
} as const;

// Para debug en desarrollo
if (process.env.NODE_ENV === 'development') {
    console.log('WooCommerce Config:', {
        url: config.woocommerce.url,
        hasConsumerKey: !!config.woocommerce.consumerKey,
        hasConsumerSecret: !!config.woocommerce.consumerSecret
    });
}
