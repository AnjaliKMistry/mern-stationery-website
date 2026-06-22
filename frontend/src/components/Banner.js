// src/components/Banner.js
import React from 'react';
import './Banner.css';
import bannerImage from '../assets/banner.jpg'; // Make sure this image exists

const Banner = () => {
  return (
    <div className="hero-banner">
      <div className="overlay">
        {/* Optional: You can add text inside the banner here */}
        <h1>Welcome to Our Stationary Store</h1>
      </div>
    </div>
  );
};

export default Banner;
