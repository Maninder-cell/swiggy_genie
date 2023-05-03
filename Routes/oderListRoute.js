const express = require("express");
const upload = require("../utils/multer");

// Import controller functions for each route
const {
  cancelOrder,
  getOrdersByStatus,
  addOrder,
  addCategories,
  getCategories,
  deleteCategories
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

router.post(
  "/upload-category",
  upload.array(),
  verifyToken,
  addCategories
);
router.get(
  "/getCategory",
  verifyToken,
  getCategories
);
router.delete(
  "/deleteCategory/:category_id",
  verifyToken,
  deleteCategories
);
module.exports = router;
