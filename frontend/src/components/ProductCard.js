// src/components/ProductCard.js
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const imageSrc = product.imageUrl
    ? `http://localhost:5000${product.imageUrl}`
    : product.image;

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div className="product-card">
      <img src={imageSrc} alt={product.name} className="product-image" />
      <h3 className="product-title">{product.name}</h3>
      {product.category && <p className="product-category">{product.category}</p>}
      <p className="product-price">₹{product.price}</p>
      <button
        className={`add-to-cart-btn ${added ? 'added' : ''}`}
        onClick={handleAddToCart}
      >
        {added ? 'Added ✓' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;
