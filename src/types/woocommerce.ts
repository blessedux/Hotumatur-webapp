export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  price: string;
  description: string;
  images: { src: string }[];
}

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: { src: string };
}
