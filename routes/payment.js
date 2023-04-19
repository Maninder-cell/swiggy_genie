const express = require("express");
const paymentController = require("../controllers/payment");
const { body } = require("express-validator");

const router = express.Router();

router.post(
    "/new",
    paymentController.payment
);

module.exports = router;