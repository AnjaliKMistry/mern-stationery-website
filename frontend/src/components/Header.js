// frontend/src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const { cartItems, resetCartLocal } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">📚 MyStationery</Link>
      </div>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">☰</button>
      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/allproducts" onClick={() => setMenuOpen(false)}>All Products</Link></li>
        {user?.role === 'admin' && <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link></li>}
        <li>
          <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </li>

        {!user ? (
          <>
            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
            <li><Link to="/signup" onClick={() => setMenuOpen(false)}>Signup</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  resetCartLocal();
                  onLogout();
                  setMenuOpen(false);
                }}
                className="logout-btn"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
