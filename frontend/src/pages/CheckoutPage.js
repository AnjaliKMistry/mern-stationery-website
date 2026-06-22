import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!shippingAddress.trim()) {
      setMessage('Please enter a shipping address.');
      return;
    }

    if (cartItems.length === 0) {
      setMessage('Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/orders',
        { shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await clearCart();
      navigate('/order-confirmation');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <h2>Checkout</h2>
        <p>Your cart is empty. Add items before checking out.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="order-summary">
        <h3>Order Summary</h3>
        {cartItems.map((item) => (
          <div className="summary-item" key={item._id}>
            <span>{item.name} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="summary-total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <form className="checkout-form" onSubmit={handlePlaceOrder}>
        <label htmlFor="shippingAddress">Shipping Address</label>
        <textarea
          id="shippingAddress"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Enter your full shipping address"
          rows={4}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
        {message && <p className="checkout-message">{message}</p>}
      </form>
    </div>
  );
};

export default CheckoutPage;
