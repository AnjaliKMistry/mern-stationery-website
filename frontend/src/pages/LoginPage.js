import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Auth.css';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const msg = sessionStorage.getItem('loginMessage');
    if (msg) {
      setMessage(msg);
      sessionStorage.removeItem('loginMessage');
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      
      // Save token & update user state
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      fetchCart();

      setMessage('Login successful!');
      setTimeout(() => {
        navigate('/'); // Redirect to homepage after login
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
