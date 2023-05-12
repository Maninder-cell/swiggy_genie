const express = require("express");
const feedBackController = require("../Controllers/feedback.js");
const { body } = require("express-validator");
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();

router.post(
  "/save",
  verifyToken,
  body("stars").isInt({ min: 1, max: 5 }),
  body("comment").isString(),
  feedBackController.feedBack
);

router.get("/list_feedbacks", verifyToken, feedBackController.listFeedbacks);

router.get("/driver_feedback/:order_id", verifyToken, feedBackController.driverFeedback);

module.exports = router;