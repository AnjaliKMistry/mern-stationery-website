import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-links">
        <Link to="/" className="footer-link">Home</Link>
        <Link to="/allproducts" className="footer-link">All Products</Link>
        <Link to="/admin" className="footer-link">Admin</Link>
        
      </div>
      
      <div className="footer-about">
        <p>
          Welcome to our Online Stationery Shop. We provide quality stationery items for schools, colleges, and offices. Our goal is to make stationery shopping simple, affordable, and quick.
        </p>
      </div>

      <div className="footer-contact">
        <p>📧 Email: support@stationeryshop.com</p>
        <p>📞 Phone: +91 98765 43210</p>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Online Stationery Shop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
