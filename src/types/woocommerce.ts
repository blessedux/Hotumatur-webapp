// src/types/woocommerce.ts
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  description: string;
  short_description: string;
  images: ProductImage[];
  categories: ProductCategory[];
  meta_data: {
    id: number;
    key: string;
    value: string;
  }[];
  attributes: {
    id: number;
    name: string;
    slug: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
  }[];
}

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface LineItem {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  total: string;
  image?: {
    src: string;
  };
  meta_data?: Array<{
    key: string;
    value: string;
  }>;
}

export interface Order {
  id: number;
  number: string;
  status: string;
  total: string;
  currency_symbol: string;
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  line_items: LineItem[
  ];
  meta_data: Array<{
    key: string;
    value: string;
  }>;
}