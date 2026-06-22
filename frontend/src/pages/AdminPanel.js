import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const API = 'http://localhost:5000/api';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    category: '',
    image: null,
  });

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/orders`, { headers: authHeaders() });
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, fetchOrders]);

  const resetForm = () => {
    setProductData({ name: '', price: '', category: '', image: null });
    setEditingId(null);
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setProductData({ ...productData, image: e.target.files[0] });
    } else {
      setProductData({ ...productData, [e.target.name]: e.target.value });
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setProductData({
      name: product.name,
      price: product.price,
      category: product.category || '',
      image: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${API}/products/${id}`, { headers: authHeaders() });
      alert('Product deleted successfully!');
      fetchProducts();
      if (editingId === id) resetForm();
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error deleting product.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      if (productData.image) {
        formData.append('image', productData.image);
      }

      if (editingId) {
        await axios.put(`${API}/products/${editingId}`, formData, {
          headers: authHeaders(),
        });
        alert('Product updated successfully!');
      } else {
        if (!productData.image) {
          alert('Please select a product image.');
          return;
        }
        await axios.post(`${API}/products`, formData, {
          headers: authHeaders(),
        });
        alert('Product added successfully!');
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error saving product.');
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.patch(
        `${API}/orders/${orderId}/status`,
        { status },
        { headers: authHeaders() }
      );
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error updating order status.');
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      <div className="admin-tabs">
        <button
          type="button"
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          type="button"
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          All Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <>
          <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="product-form">
            <label>Product Image:</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required={!editingId}
            />

            <label>Product Name:</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
            />

            <label>Price (in ₹):</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              required
            />

            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={productData.category}
              onChange={handleChange}
              required
            />

            <div className="form-actions">
              <button type="submit">{editingId ? 'Update Product' : 'Add Product'}</button>
              {editingId && (
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <h2 className="section-title">All Products</h2>
          {products.length === 0 ? (
            <p className="empty-msg">No products yet.</p>
          ) : (
            <div className="products-table-wrap">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        {product.imageUrl && (
                          <img
                            src={`http://localhost:5000${product.imageUrl}`}
                            alt={product.name}
                            className="product-thumb"
                          />
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>₹{product.price}</td>
                      <td>{product.category}</td>
                      <td className="action-cell">
                        <button type="button" onClick={() => handleEdit(product)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'orders' && (
        <>
          <h2>All Orders</h2>
          {orders.length === 0 ? (
            <p className="empty-msg">No orders placed yet.</p>
          ) : (
            <div className="orders-admin-list">
              {orders.map((order) => (
                <div className="order-admin-card" key={order._id}>
                  <div className="order-admin-header">
                    <div>
                      <strong>
                        {order.user?.name || 'Unknown user'}
                      </strong>
                      {order.user?.email && (
                        <span className="order-user-email"> ({order.user.email})</span>
                      )}
                    </div>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <ul className="order-items-list">
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
                  <div className="status-row">
                    <label htmlFor={`status-${order._id}`}>Status:</label>
                    <select
                      id={`status-${order._id}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="Placed">Placed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;
