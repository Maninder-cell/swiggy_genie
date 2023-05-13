const StripeMain = require("../services/stripe");
const { validationResult } = require("express-validator");
const db = require('../models');
const taskdetails = require("../models/taskdetails");
const User = db.User;
const Card = db.Card;
const Order = db.Order;
const Payment = db.Payment;
const TaskDetails = db.TaskDetails;
const moment = require('moment-timezone');

// exports.createCustomer = async (req, res, next) => {
//   const number = req.body.number.replace(/\s/g, '');
//   const {customer,error} = await StripeMain.createCustomer({
//     name: req.body.name,
//     email: req.body.email,
//     payment_method: {
//       type: "card",
//       card: {
//         number: number,
//         exp_month: req.body.expiry.split("/")[0],
//         exp_year: req.body.expiry.split("/")[1],
//         cvc: req.body.cvv,
//       },
//     },
//   });

//   if (error){
//     return res.status(402).json({
//       error: error,
//     });
//   }
//   else{
//     return res.status(200).json({
//       customer: customer,
//     });
//   }
// };

exports.pay = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findOne({ where: { id: req.user.id } });

  const payment = await StripeMain.Pay(
    req.body.amount,
    user.stripe_id,
    req.body.pay_id
  );

  if (payment) {
    console.log(req.body.task_id);
    const task_detail = await TaskDetails.findOne({
      where: { id: req.body.task_id },
    });
    var Order_Id = Math.random();
    Order_Id = Order_Id * 100000000;
    Order_Id = parseInt(Order_Id);
    const indianTime = moment.tz(Date.now(), 'Asia/Kolkata');
    const order_create = indianTime.format("DD MMMM YYYY, hh:mm A");
    console.log(order_create);
    const order = await Order.create({
      user_id: req.user.id,
      order_id: Order_Id,
      driver_id: "0",
      pickup_from: task_detail.pickup_from,
      deliver_to: task_detail.deliver_to,
      instruction: task_detail.Instruction,
      category_item_type: task_detail.category_item_type,
      billing_details: task_detail.billing_details,
      order_status: "0",
      order_assign: "0",
      pickup_latitude: task_detail.pickup_latitude,
      pickup_longitude: task_detail.pickup_longitude,
      delivery_latitude: task_detail.delivery_latitude,
      delivery_longitude: task_detail.delivery_longitude,
      order_created_time: order_create,

    });

    await Payment.create({ user_id: req.user.id, order_id: order.order_id, stripe_payment_id: payment.id });
  }

  return res.status(200).json({
    payment: payment,
  });
};

exports.newPaymentMethod = async (req, res, next) => {
  const user = await User.findOne({ where: { id: req.user.id } });

  if (user.stripe_id) {
    const number = req.body.number.replace(/\s/g, '');
    const result = await StripeMain.NewPaymentMethod(user.stripe_id, {
      type: "card",
      card: {
        number: number,
        exp_month: req.body.expiry.split("/")[0],
        exp_year: req.body.expiry.split("/")[1],
        cvc: req.body.cvv,
      },
    });

    if (result) {
      const payment_method = await StripeMain.getPaymentMethod(result.id)
      await Card.create({
        user_id: req.user.id,
        stripe_card_id: payment_method.id,
        card_no: payment_method.card.last4,
        name: payment_method.card.networks.available[0],
        month: payment_method.card.exp_month,
        year: payment_method.card.exp_year,
      });
    }

    return res.status(200).json({
      result: result,
    });
  }
  else {
    const number = req.body.number.replace(/\s/g, '');
    const { customer, error } = await StripeMain.createCustomer({
      name: user.name,
      email: user.email,
      payment_method: {
        type: "card",
        card: {
          number: number,
          exp_month: req.body.expiry.split("/")[0],
          exp_year: req.body.expiry.split("/")[1],
          cvc: req.body.cvv,
        },
      },
    });

    if (error) {
      return res.status(402).json({
        error: error,
      });
    }
    else {
      const payment_method = await StripeMain.getPaymentMethod(customer.invoice_settings.default_payment_method)
      await Card.create({
        user_id: req.user.id,
        stripe_card_id: payment_method.id,
        card_no: payment_method.card.last4,
        name: payment_method.card.networks.available[0],
        month: payment_method.card.exp_month,
        year: payment_method.card.exp_year,
        is_default: true
      });

      user.stripe_id = customer.id;
      user.save();

      return res.status(200).json({
        customer: customer,
      });
    }
  }
};

exports.listPaymentMethods = async (req, res, next) => {
  const user = await User.findOne({ where: { id: req.user.id } });

  if (user.stripe_id) {
    const list = await StripeMain.ListAllPaymentMethods(user.stripe_id);
    console.log(list);
    return res.status(200).json({
      list: list,
    });
  }

  return res.status(200).json({ data: [] });
};

exports.listCards = async (req, res, next) => {
  const cards = await Card.findAll({ where: { user_id: req.user.id } })

  return res.status(200).json({ cards: cards });
}

exports.listPayments = async (req, res, next) => {
  const payments = await Payment.findAll({
    attributes: ['paid', 'createdAt'],
    include: [
      {
        model: User,
        as: 'customer',
        attributes: ['name']
      },
      {
        model: Order,
        attributes: ['order_id', 'pickup_from']
      }
    ]
  });
  return res.status(200).json({ payments: payments });
}