const express = require("express");

const {
  getOrder,
  actionController,
  getOrdersByStatus,
} = require("../Controllers/driverController");

// Import middleware to verify JWT token
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();

// get order count
router.get("/getCount", verifyToken, getOrder);

// driver Accept/Reject
router.post("/action", verifyToken, actionController);

// Route to get all orders
router.get("/driverOrders", verifyToken, getOrdersByStatus);

module.exports = router;
