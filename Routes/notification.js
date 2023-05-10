const express = require("express");
const notificationController = require("../Controllers/notification");
const { body } = require("express-validator");
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();

router.post(
  "/save",
  body("text").isString(),
  notificationController.saveNotification
);

router.get("/list_notifications", verifyToken, notificationController.listNotifications);

module.exports = router;