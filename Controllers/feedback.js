const { validationResult } = require("express-validator");
const db = require("../models");
const { Op } = require("sequelize");
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
    driver_id: order.driver_id,
    order_id: order.order_id,
    stars: req.body.stars,
    comment: req.body.comment,
  }
  const feedback = await Feedback.create(obj);

  return res.status(201).json({
    success: true,
    msg: "Feedback Given Successfully",
    feedback: feedback,
  });
};
//It show the driver user rating $ review photo and name
exports.DriverlistFeedbacks = async (req, res, next) => {
  console.log(req.user.id);
  const feedbacks = await Feedback.findAll({
    where: { driver_id: req.user.id },
    include: [{
      model: User,
      as: "customer",
      attributes: ['name', 'photo_uri']
    }],
    order: [["createdAt", "DESC"]]
  });
  return res.status(200).json({
    feedbacks: feedbacks,
  });
};


exports.driverFeedback = async (req, res, next) => {
  const Order_id = req.params.order_id;
  const order = await Order.findOne({
    where: {
      order_id: Order_id
    }
  });
  const driverdetail = await User.findOne({
    where: { id: order.driver_id },
    attributes: ['name', 'photo_uri', 'phone']
  })
  return res.status(200).json({ success: true, msg: "Driver Detail Get Successfully", data: driverdetail });
}

//It show the user driver photo and name
exports.UserlistFeedbacks = async (req, res, next) => {
  console.log(req.user.id);
  const feedbacks = await Feedback.findAll({
    where: { user_id: req.user.id },
    include: [{
      model: User,
      as: "driver",
      attributes: ['name', 'photo_uri']
    }],
    order: [["createdAt", "DESC"]]
  });
  return res.status(200).json({
    success:true,
    msg:"Driver Detail Get Successfully",
    feedbacks: feedbacks,
  });
};