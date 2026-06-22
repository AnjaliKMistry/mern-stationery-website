const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');

// Place an order from the user's current cart, then clear the cart
const placeOrder = async (req, res) => {
  const { shippingAddress } = req.body;
  const userId = req.userId;

  if (!shippingAddress || !shippingAddress.trim()) {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalAmount = cart.products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    const order = await Order.create({
      userId,
      products: cart.products,
      totalAmount,
      shippingAddress: shippingAddress.trim(),
      status: 'Placed',
    });

    // Clear cart after successful order
    cart.products = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order' });
  }
};

// Fetch all orders for the authenticated user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Admin: fetch all orders from all users
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    const userIds = [...new Set(orders.map((o) => o.userId))];
    const users = await User.find({ _id: { $in: userIds } }).select('name email');
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

    const ordersWithUser = orders.map((order) => ({
      ...order,
      user: userMap[order.userId] || null,
    }));

    res.status(200).json(ordersWithUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ['Placed', 'Shipped', 'Delivered'];

  if (!status || !allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Use Placed, Shipped, or Delivered.' });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

module.exports = { placeOrder, getUserOrders, getAllOrders, updateOrderStatus };
