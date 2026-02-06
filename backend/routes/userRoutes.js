const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


/* ===============================
   ROUTES
================================ */

// Get all users
router.get('/', userController.getAllUsers);

// Get user count
router.get('/count', userController.countUsers);

module.exports = router;
