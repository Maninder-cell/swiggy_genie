const express = require("express");
const paymentController = require("../controllers/payment");
const { body } = require("express-validator");

const router = express.Router();

router.post("/create_customer",paymentController.createCustomer);
router.post("/pay",paymentController.pay);

module.exports = router;