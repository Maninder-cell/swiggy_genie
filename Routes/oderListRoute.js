const express = require("express");

// Import controller functions for each route
const {
  cancelOrder,
  getOrdersByStatus,
  addOrder,
} = require("../Controllers/orderListController");

// Import middleware to verify JWT token
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();

// Route to post  orders
router.post("/place", verifyToken, addOrder);

// Route to get all orders
router.get('/orders/:status', verifyToken,getOrdersByStatus);

// Route to cancel an order by ID
router.put("/orders/:id/cancel", verifyToken, cancelOrder);

module.exports = router;
