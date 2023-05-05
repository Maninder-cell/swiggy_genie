const { validationResult } = require("express-validator");
const db = require("../models");
const Feedback = db.Feedback;
const Order = db.Order;
const User = db.User;

exports.feedBack = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const order = await Order.findOne({ where: { order_id: req.body.order_id } });

  const obj = {
    stars: req.body.stars,
    comment: req.body.comment,
    user_id: order.driver_id,
    submit_by_id: req.user.id
  }
  const feedback = await Feedback.create(obj);

  return res.status(200).json({
    feedback: feedback,
  });
};

exports.listFeedbacks = async (req, res, next) => {
  const feedbacks = await Feedback.findAll({
    where: { submit_by_id: req.user.id },
    include: [{
      model: User,
      attributes: ['name', 'photo_uri'],
    }],
    order: [["createdAt","DESC"]]
  });

  return res.status(200).json({
    feedbacks: feedbacks,
  });
};

exports.driverFeedback = async (req, res, next) => {
  const order = await Order.findOne({ 
    where: { 
      order_id: req.params.order_id 
    },
    include: [{
      model: User,
      attributes: ['name', 'photo_uri'],
    }],
  });

  return res.json(order);
}