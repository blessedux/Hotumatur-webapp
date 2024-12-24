import axios from 'axios';
import { config } from '@/config';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.hotumatur.com', // Ensure this URL is correct
    auth: {
        username: config.woocommerce.consumerKey!,
        password: config.woocommerce.consumerSecret!
    },
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;


