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