// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    await ensureAdminExists();
    app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  })
  .catch((err) => console.log(err));

async function ensureAdminExists() {
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const existing = await User.findOne({ email: 'admin@mystationery.com' });
    if (!existing) {
      const hashed = await bcrypt.hash('Admin@123', 10);
      await User.create({ name: 'Admin', email: 'admin@mystationery.com', password: hashed, role: 'admin' });
      console.log('Admin auto-created: admin@mystationery.com / Admin@123');
    } else {
      console.log('Admin already exists');
    }
  } catch (err) {
    console.error('Admin setup error:', err.message);
  }
}
