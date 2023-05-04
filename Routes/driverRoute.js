const express = require("express");
const orderstatus = require('../Controllers/orderStatusController');
const {
  getOrder,
  actionController,
  getOrdersByStatus,
} = require("../Controllers/driverController");

// Import middleware to verify JWT token
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();

// get order count
// router.get("/getCount", verifyToken, getOrder);
router.get("/getCount", orderstatus.DriverOrderNoAssign);

// driver Accept/Reject
// router.post("/action", verifyToken, actionController);
router.post("/action/accept", orderstatus.DriverOrderAccept);

// Route to get all orders
router.get("/driverOrders/:status", verifyToken, getOrdersByStatus);

//
router.post("/Order-status/Accept", orderstatus.DriverOrderAccept);
router.post("/Order-status/Complete", orderstatus.DriverOrderComplete);
router.get("/Order-status/NoAssign", orderstatus.DriverOrderNoAssign);
router.post('/Userfcmtoken', orderstatus.Userfcmtoken);


module.exports = router;
