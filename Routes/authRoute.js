
const express = require("express");
const { login, register } = require("../Controllers/authController");
const { body, check } = require("express-validator");
const loginLimiter = require("../Middleware/limitMiddleware");

const router = express.Router();

// login route
router.post(
  "/Signin",
  [
    body("phoneNumber")
      .notEmpty()
      .withMessage("Phone number is required.")
      .isNumeric()
      .withMessage("Phone number must be numeric.")
      .isLength({ max: 15 })
      .withMessage("Phone number must be exactly 10 digits."),
  ],
  loginLimiter,
  login
);

// register route
router.post(
  "/Signup",
  [
    body("phoneNumber")
      .notEmpty()
      .withMessage("Phone number is required.")
      .isNumeric()
      .withMessage("Phone number must be numeric.")
      .isLength({max: 15 })
      .withMessage("Phone number must be exactly 10 digits."),
  ],
  loginLimiter,
  register
);

module.exports = router;
