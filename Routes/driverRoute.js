const express = require("express");
const orderstatus = require('../Controllers/orderStatusController');

// Import middleware to verify JWT token
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();

router.get("/driver/getCount", verifyToken, orderstatus.DriverOrderNoAssign);

router.post("/driver/action/accept", verifyToken, orderstatus.DriverOrderAccept);
router.get("/driver/action/accept", verifyToken, orderstatus.GetDriverOrderAccepted);

router.get("/driver/action/complete", verifyToken, orderstatus.GetDriverOrderCompleled);
router.post("/driver/action/complete", verifyToken, orderstatus.DriverOrderComplete);

router.get("/driver/action/cancel", verifyToken, orderstatus.GetDriverOrderCancelled);
router.post("/driver/action/cancel", verifyToken, orderstatus.DriverOrderCancell);

router.get("/driver/action/reject", verifyToken, orderstatus.GetDriverOrderRejected);
router.post("/driver/action/reject", verifyToken, orderstatus.DriverOrderReject);

router.get("/driver/action/all", verifyToken, orderstatus.GetDriverOrderAll);

// Route to get all 
// router.post("/Order-status/Accept", verifyToken, orderstatus.DriverOrderAccept);
router.get("/fcmtoken", orderstatus.driverfcm);
// router.post("/Order-status/Complete", orderstatus.DriverOrderComplete);
// router.get("/Order-status/NoAssign", verifyToken, orderstatus.DriverOrderNoAssign);
router.post('/Userfcmtoken', orderstatus.Userfcmtoken);


module.exports = router;
