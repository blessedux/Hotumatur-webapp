import axios from 'axios';
import { config } from '@/config';

const api = axios.create({
    baseURL: config.woocommerce.url,
    auth: {
        username: config.woocommerce.consumerKey!,
        password: config.woocommerce.consumerSecret!
    },
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
    console.log('API Request:', {
        url: request.url,
        method: request.method,
        hasAuth: !!request.auth,
        baseURL: request.baseURL
    });
    return request;
}, error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
});

// Add response interceptor for debugging
api.interceptors.response.use(response => {
    console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url
    });
    return response;
}, error => {
    console.error('API Response Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        message: error.message
    });
    return Promise.reject(error);
});

export default api;


