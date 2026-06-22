import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [strength, setStrength] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkStrength = (pass) => {
    if (pass.length === 0) return setStrength('');
    const checks = [
      /[A-Z]/.test(pass),
      /[a-z]/.test(pass),
      /[0-9]/.test(pass),
      /[^A-Za-z0-9]/.test(pass),
      pass.length >= 8,
    ];
    const score = checks.filter(Boolean).length;
    if (score <= 2) setStrength('weak');
    else if (score <= 3) setStrength('medium');
    else setStrength('strong');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/users/signup', form);
      setMessage('Signup successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500); // Redirect to login page after 1.5 seconds
    } catch (err) {
      setMessage(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
          onChange={(e) => { handleChange(e); checkStrength(e.target.value); }}
          required
        />
        {strength && (
          <div className={`strength-bar ${strength}`}>
            <div className="strength-fill"></div>
            <span className="strength-label">
              {strength === 'weak' && '⚠️ Weak — add uppercase, numbers & symbols'}
              {strength === 'medium' && '🔶 Medium — almost there!'}
              {strength === 'strong' && '✅ Strong password'}
            </span>
          </div>
        )}
        <button type="submit">Signup</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default SignupPage;
