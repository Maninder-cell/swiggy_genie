const express = require("express");

// Import controller functions for each route
const {
  // CategoryOrder,
  AddCategory,
  getCategory,
  cancelOrder,
  getOrdersByStatus,
  addOrder,
  getask,
  addtask
} = require("../Controllers/orderListController");

// Import middleware to verify JWT token
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();
// Route to post  orders

router.post("/place", verifyToken, addOrder);
router.post("/task", verifyToken, addtask);
router.get('/taskdetails', verifyToken, getask);
// Route to get all orders
router.get("/orders/:status", verifyToken, getOrdersByStatus);

// Route to cancel an order by ID
router.put("/orders/:id/cancel", verifyToken, cancelOrder);

router.post("/Order/Category", verifyToken, AddCategory)
router.get("/Order/Category", getCategory);
// router.post("/Order/CategoryOrder", CategoryOrder);

module.exports = router;
