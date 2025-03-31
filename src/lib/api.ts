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
    console.log('[API] Request:', {
        url: request.url,
        method: request.method,
        hasAuth: !!request.auth,
        baseURL: request.baseURL,
        headers: {
            ...request.headers,
            Authorization: request.headers.Authorization ? '***' : undefined
        }
    });
    return request;
}, error => {
    console.error('[API] Request Error:', {
        message: error.message,
        code: error.code,
        config: error.config ? {
            url: error.config.url,
            method: error.config.method,
            baseURL: error.config.baseURL
        } : undefined
    });
    return Promise.reject(error);
});

// Add response interceptor for debugging
api.interceptors.response.use(response => {
    console.log('[API] Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: typeof response.data === 'object' ? {
            type: Array.isArray(response.data) ? 'array' : 'object',
            length: Array.isArray(response.data) ? response.data.length : Object.keys(response.data).length
        } : typeof response.data
    });
    return response;
}, error => {
    console.error('[API] Response Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        message: error.message,
        response: error.response ? {
            data: error.response.data,
            headers: error.response.headers
        } : undefined,
        request: error.request ? {
            method: error.request.method,
            path: error.request.path,
            headers: error.request.headers
        } : undefined
    });
    return Promise.reject(error);
});

export default api;


