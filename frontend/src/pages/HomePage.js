// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import AllProducts from '../components/AllProducts';
import axios from 'axios';
import './ProductGrid.css';
import Footer from '../components/Footer';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [homeMessage, setHomeMessage] = useState('');

  useEffect(() => {
    const msg = sessionStorage.getItem('homeMessage');
    if (msg) {
      setHomeMessage(msg);
      sessionStorage.removeItem('homeMessage');
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      {homeMessage && (
        <div className="home-alert" style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '12px 20px',
          textAlign: 'center',
          borderBottom: '1px solid #ffc107',
        }}>
          {homeMessage}
        </div>
      )}
      <Banner />
      <AllProducts products={products} />
      <Footer />
    </>
  );
};

export default HomePage;
