const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const newProduct = new Product({ name, price, category, imageUrl });
    await newProduct.save();

    res.status(201).json({ message: 'Product added', product: newProduct });
  } catch (err) {
    res.status(500).json({ error: 'Error adding product' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const update = {};

    if (name) update.name = name;
    if (price !== undefined && price !== '') update.price = price;
    if (category) update.category = category;
    if (req.file) update.imageUrl = `/uploads/${req.file.filename}`;

    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};
