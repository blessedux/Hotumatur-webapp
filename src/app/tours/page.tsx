import { getProducts } from '@/services/woocommerce';
import { WooProduct } from '@/types/woocommerce';
import React from 'react';

// Mark the component as async
async function ProductsPage() {
  // Fetch data directly in the component
  const products: WooProduct[] = await getProducts();

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>{product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductsPage;
