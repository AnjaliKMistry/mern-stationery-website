require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existing = await User.findOne({ email: 'admin@mystationery.com' });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@mystationery.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin created successfully: admin@mystationery.com / Admin@123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
