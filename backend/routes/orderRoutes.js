const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");


// Admin view
router.get("/", orderController.getOrders);


// Checkout
router.post("/", orderController.createOrder);


// Update status
router.put("/:id", orderController.updateStatus);


// Delete
router.delete("/:id", orderController.deleteOrder);


module.exports = router;
