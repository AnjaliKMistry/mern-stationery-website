// src/pages/AllProductsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AllProducts from '../components/AllProducts';

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return <AllProducts products={products} />;
};

export default AllProductsPage;
