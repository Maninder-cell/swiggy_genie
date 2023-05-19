const StripeMain = require("../services/stripe");
const { validationResult } = require("express-validator");
const db = require('../models');
const Card = db.Card;
const Order = db.Order;
const User = db.User;
const Payment = db.Payment;
const TaskDetails = db.TaskDetails;
const User_fcmtoken = db.User_fcmtoken;
const moment = require('moment-timezone');

var admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json");
// Check if the default app is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

exports.pay = async (req, res, next) => {
  try {
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
    const data = req.body.task_id;
    if (payment) {
      const task_detail = await TaskDetails.findOne({
        limit: 1,
        where: { id: data },
        order: [['createdAt', 'DESC']]
      });
      var Order_Id = Math.random();
      Order_Id = Order_Id * 100000000;
      Order_Id = parseInt(Order_Id);
      console.log("rhgfsdgjfhf", task_detail.pickup_from);
      const indianTime = moment.tz(Date.now(), 'Asia/Kolkata');
      const order_create = indianTime.format("DD MMMM YYYY, hh:mm A");
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
        distance_km: task_detail.distance_km,
        order_created_time: order_create,

      });
      await Payment.create({ user_id: req.user.id, order_id: order.order_id, stripe_payment_id: payment.id });
      const fcmtoken = await User.findAll({
        where: { account_type: "1" },
        include: [{
          model: User_fcmtoken,
          as: 'token',
          attributes: ['fcmtoken'],
          required: true
        }]
      });

      const fcmlength = fcmtoken.length;
      for (var i = 0; i < fcmlength; i++) {
        var storetoken = [];
        storetoken = fcmtoken[i].token;
        const storelength = storetoken.length;
        for (var j = 0; j < storelength; j++) {
          // console.log('ffffffffffffffffffffffffffffffffffffffffffffffffff', storetoken[j].dataValues.fcmtoken);
          let message = {
            notification: {
              title: "New Order Arrived", body: `New order will arrive  #${order.order_id}`,
            },
            token: storetoken[j].dataValues.fcmtoken
          };
          admin.messaging().send(message);
        }
      }
    }
    return res.status(200).json({
      payment: payment,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
};

exports.newPaymentMethod = async (req, res, next) => {
  const user = await User.findOne({ where: { id: req.user.id } });

  if (user.stripe_id) {
    const number = req.body.number.replace(/\s/g, '');
    const { attach, error } = await StripeMain.NewPaymentMethod(user.stripe_id, {
      type: "card",
      card: {
        number: number,
        exp_month: req.body.expiry.split("/")[0],
        exp_year: req.body.expiry.split("/")[1],
        cvc: req.body.cvv,
      },
    });

    if (error) {
      return res.status(402).json({
        error: error,
      });
    }
    else {
      const payment_method = await StripeMain.getPaymentMethod(attach.id)
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
      result: attach,
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


module.exports.driverfcm = async (req, res) => {
  try {
    const fcmtoken = await User.findAll({
      where: { account_type: "1" },
      include: [{
        model: User_fcmtoken,
        as: 'token',
        attributes: ['fcmtoken'],
        required: true
      }]
    });

    const fcmlength = fcmtoken.length;
    for (var i = 0; i < fcmlength; i++) {
      var storetoken = [];
      storetoken = fcmtoken[i].token;
      const storelength = storetoken.length;
      for (var j = 0; j < storelength; j++) {
        console.log('ffffffffffffffffffffffffffffffffffffffffffffffffff', storetoken[j].dataValues.fcmtoken);
        let message = {
          notification: {
            title: "Order Confirmed", body: `A new Order will arrived`,
          },
          token: storetoken[j].dataValues.fcmtoken
        };
        admin.messaging().send(message);
      }
    }
    console.log(fcmtoken);
    res.json({ fcmtoken, length: fcmlength });
  }
  catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}