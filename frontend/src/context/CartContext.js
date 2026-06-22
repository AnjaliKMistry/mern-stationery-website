import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();
const API_BASE = 'http://localhost:5000/api';

// Decode user ID from JWT stored in localStorage
const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch {
    return null;
  }
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// Map backend cart products to frontend cart item shape
const mapCartProducts = (products = []) =>
  products.map((p) => ({
    _id: p.productId,
    productId: p.productId,
    name: p.name,
    price: p.price,
    quantity: p.quantity,
    imageUrl: p.image,
  }));

// Convert a product from the API into the shape expected by the cart API
const toCartProduct = (product, quantity = 1) => ({
  productId: product._id,
  name: product.name,
  price: product.price,
  quantity,
  image: product.imageUrl || product.image,
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      const res = await axios.get(`${API_BASE}/cart/${userId}`, {
        headers: getAuthHeaders(),
      });
      setCartItems(mapCartProducts(res.data.products));
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  }, []);

  // Load cart from backend when a logged-in user is detected
  useEffect(() => {
    if (getUserIdFromToken()) {
      fetchCart();
    }
  }, [fetchCart]);

  const addToCart = async (product) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      sessionStorage.setItem('loginMessage', 'Please login to add items to cart');
      navigate('/login');
      return;
    }

    const cartProduct = toCartProduct(product);

    // Optimistic local update
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    try {
      await axios.post(
        `${API_BASE}/cart/add`,
        { product: cartProduct },
        { headers: getAuthHeaders() }
      );
    } catch (err) {
      console.error('Failed to persist cart item:', err);
      fetchCart();
    }
  };

  const removeFromCart = async (productId) => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    setCartItems((prev) => prev.filter((item) => item._id !== productId));

    try {
      await axios.delete(`${API_BASE}/cart/${userId}/${productId}`, {
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error('Failed to remove cart item:', err);
      fetchCart();
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    const userId = getUserIdFromToken();
    if (!userId || newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      await axios.put(
        `${API_BASE}/cart/${userId}/${productId}`,
        { quantity: newQuantity },
        { headers: getAuthHeaders() }
      );
    } catch (err) {
      console.error('Failed to update quantity:', err);
      fetchCart();
    }
  };

  const clearCart = async () => {
    const userId = getUserIdFromToken();
    setCartItems([]);

    if (!userId) return;

    try {
      await axios.delete(`${API_BASE}/cart/${userId}/clear`, {
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const resetCartLocal = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        resetCartLocal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
