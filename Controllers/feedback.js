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
    user_id: req.user.id,
    driver_id: order.user_id,
    order_id: order.order_id,
    stars: req.body.stars,
    comment: req.body.comment,
  }
  const feedback = await Feedback.create(obj);

  return res.status(200).json({
    feedback: feedback,
  });
};

exports.listFeedbacks = async (req, res, next) => {
  const feedbacks = await Feedback.findAll({
    where: { user_id: req.user.id },
    order: [["createdAt", "DESC"]]
  });
  console.log(feedbacks);
  return res.status(200).json({
    feedbacks: feedbacks,
  });
};

exports.driverFeedback = async (req, res, next) => {
  console.log('amsdm');
  const Order_id = req.params.order_id;
  const order = await Order.findOne({
    where: {
      order_id: Order_id
    }
  });
  const driverdetail = await User.findOne({
    where: { id: order.driver_id },
    attributes: ['name', 'photo_uri']
  })
  console.log(driverdetail);
  return res.json(driverdetail);
}