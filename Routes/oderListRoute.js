const express = require('express');

// Import controller functions for each route
const {cancelOrder,getOrdersByStatus,addOrder} = require("../Controllers/orderListController");

// Import middleware to verify JWT token
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();
// Route to post  orders
router.post('/place',verifyToken,addOrder);

// Route to get all orders
router.get('/orders', verifyToken,getOrdersByStatus);

// Route to get all pending orders
router.get('/pending', verifyToken,getOrdersByStatus);

// Route to get all completed orders
router.get('/completed', verifyToken,getOrdersByStatus);

// Route to get all accepted orders
router.get('/accepted', verifyToken,getOrdersByStatus);

// Route to get all cancelled orders
router.get('/cancelled', verifyToken,getOrdersByStatus);

// Route to cancel an order by ID
router.put('/orders/:id/cancel', verifyToken,cancelOrder);

module.exports = router;
