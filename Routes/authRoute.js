const express = require("express");
const { login, register, logout, loginDriver } = require("../Controllers/authController");
const { body } = require("express-validator");
// const loginLimiter = require("../Middleware/limitMiddleware");
const verifyToken = require("../Middleware/verifyToken");

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
      .isLength({ min: 9, max: 15 })
      .withMessage("Please enter correct phoneNumber."),
  ],
  login
);
router.post(
  "/Driver/Signin",
  [
    body("phoneNumber")
      .notEmpty()
      .withMessage("Phone number is required.")
      .isNumeric()
      .withMessage("Phone number must be numeric.")
      .isLength({ min: 9, max: 15 })
      .withMessage("Please enter correct phoneNumber."),
  ],
  loginDriver
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
      .isLength({ min: 9, max: 15 })
      .withMessage("Please enter correct phoneNumber."),
  ],
  register
);

// logout route
router.post("/logout", verifyToken, logout);

module.exports = router;
