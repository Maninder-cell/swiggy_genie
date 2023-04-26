const express = require('express');

const {
    getOrdersByStatus,
    getCompletedOrdersCount,
} = require("../Controllers/driverController");


// Import middleware to verify JWT token
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();

// get order count
router.get("/getCount",getCompletedOrdersCount);

// Route to get all orders
router.get('/orders', verifyToken, getOrdersByStatus);

// Route to get all pending orders
router.get('/pending', verifyToken, getOrdersByStatus);

// Route to get all completed orders
router.get('/completed', verifyToken, getOrdersByStatus);

// Route to get all accepted orders
router.get('/accepted', verifyToken, getOrdersByStatus);

// Route to get all cancelled orders
router.get('/rejected', verifyToken, getOrdersByStatus);

module.exports = router;
