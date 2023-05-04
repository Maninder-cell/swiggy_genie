const express = require("express");
const paymentController = require("../Controllers/payment");
const { body } = require("express-validator");

const router = express.Router();

router.post("/create_customer",paymentController.createCustomer);
router.post(
    "/pay",
    body('amount').isInt(),
    paymentController.pay
);
router.post("/new_payment_method",paymentController.newPaymentMethod);
router.get("/list_payment_methods",paymentController.listPaymentMethods);

module.exports = router;