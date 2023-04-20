const express = require("express");
const feedBackController = require("../controllers/feedback.js");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/save",
  body("stars").isInt({ min: 1, max: 5 }),
  body("comment").isString(),
  feedBackController.feedBack
);

router.get("/list_feedbacks", feedBackController.listFeedbacks);

module.exports = router;
