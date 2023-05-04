const express = require("express");
const notificationController = require("../Controllers/notification");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/save",
  body("text").isString(),
  notificationController.saveNotification
);

router.get("/list_notifications", notificationController.listNotifications);

module.exports = router;