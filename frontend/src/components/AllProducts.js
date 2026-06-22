// src/components/AllProducts.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import './AllProducts.css';

const AllProducts = ({ products: productsProp }) => {
  const [products, setProducts] = useState(productsProp || []);

  useEffect(() => {
    if (productsProp) {
      setProducts(productsProp);
      return;
    }

    axios
      .get('http://localhost:5000/api/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, [productsProp]);

  return (
    <div className="all-products-container">
      <h2>All Products</h2>
      <div className="products-grid">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default AllProducts;
