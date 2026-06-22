const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { verifyToken } = require('../middleware/authMiddleware');

// All cart routes require authentication
router.use(verifyToken);

// Add item to cart
router.post('/add', async (req, res) => {
  const { product } = req.body;
  const userId = req.userId;

  if (!product || !product.productId) {
    return res.status(400).json({ error: 'Product data is required' });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [{ ...product, quantity: product.quantity || 1 }] });
    } else {
      const existingProduct = cart.products.find((p) => p.productId === product.productId);

      if (existingProduct) {
        existingProduct.quantity += product.quantity || 1;
      } else {
        cart.products.push({ ...product, quantity: product.quantity || 1 });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// Get cart items for authenticated user
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    res.status(200).json(cart || { products: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Clear entire cart (used after checkout)
router.delete('/:userId/clear', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(200).json({ message: 'Cart already empty', products: [] });
    }

    cart.products = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared', products: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Remove a specific product from cart
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.products = cart.products.filter((p) => p.productId !== req.params.productId);
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Update quantity of a specific product
router.put('/:userId/:productId', async (req, res) => {
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }

  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const product = cart.products.find((p) => p.productId === req.params.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    product.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

module.exports = router;
