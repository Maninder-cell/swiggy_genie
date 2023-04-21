const express = require("express");
const { login, register } = require("../Controllers/authController");
const { body, check } = require("express-validator");
const router = express.Router();

// login route
router.post(
  "/Signin",
  [
    body("PhoneNumber")
      .notEmpty()
      .withMessage("Phone number is required.")
      .isNumeric()
      .withMessage("Phone number must be numeric.")
      .isLength({ min: 10, max: 12 })
      .withMessage("Phone number must be exactly 10 digits."),
  ],
  login
);

// register route
router.post(
  "/Signup",
  [
    body("PhoneNumber")
      .notEmpty()
      .withMessage("Phone number is required.")
      .isNumeric()
      .withMessage("Phone number must be numeric.")
      .isLength({ min: 10, max: 12 })
      .withMessage("Phone number must be exactly 10 digits."),
  ],
  register
);

module.exports = router;
