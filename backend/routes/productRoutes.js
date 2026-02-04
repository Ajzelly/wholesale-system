const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: 'backend/uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname),
});
const upload = multer({ storage });

// Routes
router.get('/', productController.getAllProducts);

router.post('/', upload.single('image'), productController.addProduct);

router.delete('/:id', productController.deleteProduct);

module.exports = router;
