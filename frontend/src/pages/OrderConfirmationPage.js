import React from 'react';
import { Link } from 'react-router-dom';
import './CheckoutPage.css';

const OrderConfirmationPage = () => {
  return (
    <div className="checkout-page">
      <div className="order-summary" style={{ textAlign: 'center' }}>
        <h2>Order Placed Successfully! ✓</h2>
        <p style={{ color: '#555', margin: '16px 0' }}>
          Thank you for your order. We will ship your items soon.
        </p>
        <Link to="/allproducts" className="browse-link" style={{ display: 'inline-block', marginTop: '12px' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
