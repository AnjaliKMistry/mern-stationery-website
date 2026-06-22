const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + unique);
  },
});

const upload = multer({ storage });

router.get('/', getAllProducts);
router.post('/', verifyToken, isAdmin, upload.single('image'), addProduct);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;
