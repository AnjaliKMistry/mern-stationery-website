// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import HomePage from './pages/HomePage';
import AllProductsPage from './pages/AllProductsPage';
import Header from './components/Header';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import { CartProvider } from './context/CartContext';

function App() {
  const [user, setUser] = useState(null);

  // Restore logged-in user from token on page refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'));
  }, []);

  return (
    <Router>
      <CartProvider>
        <Header user={user} onLogout={() => setUser(null)} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/allproducts" element={<AllProductsPage />} />
          <Route path="/signup" element={<SignupPage setUser={setUser} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute user={user}>
                <AdminPanel />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
