const express = require('express');

// Import controller functions for each route
const {
  getAll,
  cancelled,
  cancelOrder,
  pending,
  completed,
  accepted,
  order
} = require("../Controllers/orderListController");

// Import middleware to verify JWT token
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();
// Route to post  orders
router.post('/place',verifyToken,order);

// Route to get all orders
router.get('/orders', verifyToken, getAll);

// Route to get all pending orders
router.get('/pending', verifyToken, pending);

// Route to get all completed orders
router.get('/completed', verifyToken, completed);

// Route to get all accepted orders
router.get('/accepted', verifyToken, accepted);

// Route to get all cancelled orders
router.get('/cancelled', verifyToken, cancelled);

// Route to cancel an order by ID
router.put('/orders/:id/cancel', verifyToken, cancelOrder);

module.exports = router;
