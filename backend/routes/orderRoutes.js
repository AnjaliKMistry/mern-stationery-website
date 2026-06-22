const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', isAdmin, getAllOrders);
router.post('/', placeOrder);
router.patch('/:orderId/status', isAdmin, updateOrderStatus);
router.get('/:userId', getUserOrders);

module.exports = router;
