const { validationResult } = require("express-validator");
const db = require("../models");
const Notification = db.Notification;

exports.saveNotification = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const notification = await Notification.create(req.body);

  return res.status(200).json({
    notification: notification,
  });
};

exports.listNotifications = async (req, res, next) => {
  const notifications = await Notification.findAll({
    where: { user_id: 2 },
    order: [["createdAt","DESC"]]
  });

  return res.status(200).json({
    notifications: notifications,
  });
};