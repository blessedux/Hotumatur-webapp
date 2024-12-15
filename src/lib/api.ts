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

export default api;


