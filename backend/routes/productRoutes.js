const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const productController = require('../controllers/productController');

// Multer setup for image upload
// __dirname = /path/to/backend/routes
// So we need to go up 2 levels: .. -> backend, .. -> wholesale-system, then into backend/uploads
const uploadDir = path.join(__dirname, '..', '..', 'backend', 'uploads');

console.log('📁 Upload directory:', uploadDir);

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + '_' + file.originalname;
    console.log('💾 Saving file:', filename);
    cb(null, filename);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Routes
router.get('/', productController.getAllProducts);

router.post('/', upload.single('image'), productController.addProduct);

router.delete('/:id', productController.deleteProduct);

module.exports = router;
