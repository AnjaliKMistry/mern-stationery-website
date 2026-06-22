import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);

        // Fetch user's past orders
        const ordersRes = await axios.get(
          `http://localhost:5000/api/orders/${res.data._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(ordersRes.data);
      } catch (err) {
        console.log('Error fetching profile:', err);
      }
    };

    if (token) fetchProfile();
  }, []);

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      {user ? (
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      <div className="my-orders">
        <h3>My Orders</h3>
        {orders.length === 0 ? (
          <p className="no-orders">No orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-header">
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="order-status">{order.status}</span>
                </div>
                <ul className="order-items">
                  {order.products.map((item) => (
                    <li key={item.productId}>
                      {item.name} × {item.quantity} — ₹{item.price * item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="order-total">Total: ₹{order.totalAmount}</p>
                <p className="order-address">
                  <strong>Address:</strong> {order.shippingAddress}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
