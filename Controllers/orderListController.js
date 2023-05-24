const models = require("../models");
const Category = models.Category;
const Order = models.Order;
const User = models.User;
const TaskDetails = models.TaskDetails;
const { getDistance } = require('geolib');
const moment = require('moment');
const { validationResult } = require("express-validator");

module.exports.addtask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order_create = moment().format("DD MMMM YYYY, hh:mm A");
    const attr = { ...req.body };
    const task = await TaskDetails.create({
      user_id: req.user.id,
      pickup_from: attr.pickup_from,
      deliver_to: attr.deliver_to,
      instruction: attr.instruction,
      category_item_type: attr.category_item_type,
      billing_details: "0",
      pickup_latitude: attr.pickup_latitude,
      pickup_longitude: attr.pickup_longitude,
      delivery_latitude: attr.delivery_latitude,
      delivery_longitude: attr.delivery_longitude,
      order_created_time: order_create,
    });

    return res.status(201).json({
      success: true,
      msg: "Order Task Created Sucessfully",
      order: task,
    });
  }
  catch (err) {
    console.log(err);
    return res.status(200).json({ Message: "Something Went Wrong" });
  }
};

module.exports.getask = async (req, res, next) => {
  try {
    const task = await TaskDetails.findOne({
      limit: 1,
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    })

    let item_price = 0;

    if (task.category_item_type.includes('Food Item')) {
      item_price += 10;
    }
    if (task.category_item_type.includes('Medicine')) {
      item_price += 20;
    }
    if (task.category_item_type.includes('Documents or Books')) {
      item_price += 30;
    }
    if (task.category_item_type.includes('Clothes')) {
      item_price += 40;
    }
    if (task.category_item_type.includes('Electronics')) {
      item_price += 50;
    }
    if (task.category_item_type.includes('Items for Repair')) {
      item_price += 60;
    }
    if (task.category_item_type.includes('Business Deliveries')) {
      item_price += 70;
    }
    if (task.category_item_type.includes('Others')) {
      item_price += 100;
    }

    //Distance between the task pickup,deliver latitude and longitude
    const pickup = { latitude: task.pickup_latitude, longitude: task.pickup_longitude };
    const delivery = { latitude: task.delivery_latitude, longitude: task.delivery_longitude };
    const distanceInMeters = getDistance(pickup, delivery);
    const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);

    const totalPrice = item_price;
    const taskupdate = await task.update({
      billing_details: totalPrice,
      distance_km: distanceInKilometers
    });
    return res.status(200).json({ success: true, msg: "Order Task details get Successfully", taskupdate });
  }
  catch (err) {
    console.log(err);
    return res.status(400).json({ Message: "Something Went Wrong" });
  }
}

//User show the Order history
module.exports.getOrdersByStatus = async (req, res) => {
  try {
    const user_id = req.user.id;
    let orders;
    const status = req.params.status;
    switch (true) {

      case status === "0":
        orders = await Order.findAll({
          where: { user_id: user_id, order_status: "0" },
          order: [["order_created_time", "DESC"]],
        });
        break;

      case status === "1":
        orders = await Order.findAll({
          where: { user_id: user_id, order_status: "1" },
          order: [["order_created_time", "DESC"]],
        });
        break;

      case status === "2":
        orders = await Order.findAll({
          where: { user_id: user_id, order_status: "2" },
          order: [["order_created_time", "DESC"]],
        });
        break;

      case status === "3":
        orders = await Order.findAll({
          where: { user_id: user_id, order_status: "3" },
          order: [["order_created_time", "DESC"]],
        });
        break;

      default:
        orders = await Order.findAll({ where: { user_id: user_id }, order: [["order_created_time", "DESC"]], });
        break;
    }
    res.status(200).json({ success: true, msg: "Order Detail Get Successfully", orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Cancel an order by ID
module.exports.cancelOrder = async (req, res) => {
  try {
    const orderCancelData = req.body.order_id;
    const order = await Order.findOne({
      where: { order_id: orderCancelData },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.order_status == "1" || order.order_status == "0") {
      const orderCancel = await order.update({
        order_status: "3",
      });
      return res.status(200).json({ success: true, msg: "User Cancelled Order", data: orderCancel});
    };
    return res.json({ msg: "Order Can't Cancelled" });
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}

module.exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findAll({
      attributes: ['id', 'name', 'path', 'icon_name']
    });
    return res.status(200).json({ success: true, msg: "Category data get Successfully", data: category });
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}


module.exports.AddCategory = async (req, res) => {
  try {
    const user = req.user.id;
    const Admin = await User.findOne({
      where: { id: user }
    });
    if (Admin.account_type == "0") {
      const { name, path, icon_name } = req.body;
      const category = await Category.create({
        name: name,
        path: path,
        icon_name: icon_name
      })
      return res.json({ data: category });
    } else {
      return res.json({ msg: "You have no permissions" });
    }
  }
  catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}


