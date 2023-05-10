const express = require("express");
const paymentController = require("../Controllers/payment");
const { body } = require("express-validator");
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();

// router.post("/create_customer",verifyToken,paymentController.createCustomer);

router.post(
    "/pay",
    verifyToken,
    body('amount').isInt(),
    paymentController.pay
);
router.post("/new_payment_method",verifyToken,paymentController.newPaymentMethod);
router.get("/list_payment_methods",verifyToken,paymentController.listPaymentMethods);
router.get("/cards",verifyToken,paymentController.listCards);
router.get("/list_payments",verifyToken,paymentController.listPayments);

module.exports = router;