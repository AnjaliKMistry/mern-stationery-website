import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h2>Your Cart</h2>
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/allproducts" className="browse-link">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item._id}>
            <img
              src={
                item.imageUrl
                  ? `http://localhost:5000${item.imageUrl}`
                  : item.image
              }
              alt={item.name}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="cart-item-price">₹{item.price}</p>
              <div className="quantity-controls">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <p className="cart-item-subtotal">
                Subtotal: ₹{item.price * item.quantity}
              </p>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <p className="cart-total">Total: ₹{total}</p>
        <button className="checkout-btn" onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
