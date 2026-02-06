const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getOrders);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateStatus);
router.delete('/:id', orderController.deleteOrder);

// New endpoints
router.get('/count', orderController.getOrderCount);
router.get('/revenue', orderController.getTotalRevenue);
router.get('/recent', orderController.getRecentOrders);

module.exports = router;
