const express = require("express");
const orderstatus = require('../Controllers/orderStatusController');
const {
  getOrdersByStatus,
} = require("../Controllers/driverController");
// Import middleware to verify JWT token
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();
// get order count
// router.get("/getCount", verifyToken, getOrder);
router.get("/driver/getCount", verifyToken, orderstatus.DriverOrderNoAssign);

// driver Accept/Reject
// router.post("/action", verifyToken, actionController);
router.post("/driver/action/accept", verifyToken, orderstatus.DriverOrderAccept);

router.get("/driver/action/complete", verifyToken, orderstatus.GetDriverOrderCompleled);

router.get("/driver/action/cancell", verifyToken, orderstatus.GetDriverOrderCancelled);

router.get("/driver/action/reject", verifyToken, orderstatus.GetDriverOrderRejected);

router.post("/driver/action/reject", verifyToken, orderstatus.DriverOrderReject);


router.patch("/driver/action/cancell", verifyToken, orderstatus.DriverOrderCancell);
// Route to get all orders
router.get("/driverOrders/:status", verifyToken, getOrdersByStatus);

//
router.post("/Order-status/Accept", verifyToken, orderstatus.DriverOrderAccept);
router.post("/Order-status/Complete", orderstatus.DriverOrderComplete);
router.get("/Order-status/NoAssign",verifyToken, orderstatus.DriverOrderNoAssign);
router.post('/Userfcmtoken', orderstatus.Userfcmtoken);


module.exports = router;
