interface Config {
    app: {
        appUrl: string;
    };
    flow: {
        apiKey: string | undefined;
        secretKey: string | undefined;
        apiUrl: string | undefined;
    };
    woocommerce: {
        url: string;
        consumerKey: string;
        consumerSecret: string;
    };
}

export const config: Config = {
    app: {
        appUrl: process.env.NEXT_PUBLIC_APP_URL || ''
    },
    flow: {
        apiKey: process.env.FLOW_API_KEY,
        secretKey: process.env.FLOW_SECRET_KEY,
        apiUrl: process.env.FLOW_API_URL
    },
    woocommerce: {
        url: process.env.NEXT_PUBLIC_WC_API_URL || '',
        consumerKey: process.env.WC_CONSUMER_KEY || '',
        consumerSecret: process.env.WC_CONSUMER_SECRET || ''
    }
};

// Para debug en desarrollo
if (process.env.NODE_ENV === 'development') {
    console.log('Config:', {
        flow: {
            hasApiKey: !!config.flow.apiKey,
            hasSecretKey: !!config.flow.secretKey,
            apiUrl: config.flow.apiUrl
        },
        app: {
            appUrl: config.app.appUrl
        }
    });
}
