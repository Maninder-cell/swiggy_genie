const express = require("express");
const paymentController = require("../Controllers/payment");
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();


router.get("/payment/list_payment_methods", verifyToken, paymentController.listPaymentMethods);
router.get("/payment/cards", verifyToken, paymentController.listCards);
router.get("/payment/list_payments", verifyToken, paymentController.listPayments);


router.post("/payment/pay", verifyToken, paymentController.pay);
router.post("/payment/new_payment_method", verifyToken, paymentController.newPaymentMethod);


module.exports = router;