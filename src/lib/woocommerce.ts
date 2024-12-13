import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL}/wp-json/wc/v3/`,
  auth: {
    username: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
    password: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
  },
});

export default api;
