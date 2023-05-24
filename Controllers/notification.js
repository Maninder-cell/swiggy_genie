const { validationResult } = require("express-validator");
const db = require("../models");
const Notification = db.Notification;

exports.saveNotification = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const notification = await Notification.create({
    user_id: req.user.id,
    text: req.body.text
  });

  return res.status(201).json({
    success: true,
    msg: "Notification Created Successfully",
    notification: notification,
  });
};

exports.listNotifications = async (req, res, next) => {
  const notifications = await Notification.findAll({
    where: { user_id: req.user.id },
    order: [["createdAt", "DESC"]]
  });

  return res.status(200).json({
    success: true,
    msg: "Notification Get Successfully",
    notifications: notifications,
  });
};