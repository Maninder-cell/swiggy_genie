const models = require("../models");
const Order = models.Order;
const Task = models.task;
// const OrderStatus = models.OrderStatus;
const moment = require('moment');
const { validationResult } = require("express-validator");
const mbxClient = require("@mapbox/mapbox-sdk");
const mbxDirections = require("@mapbox/mapbox-sdk/services/directions");
const baseClient = mbxClient({
  accessToken:
    "pk.eyJ1IjoibmF1c2hhZGlhIiwiYSI6ImNsZ296eXA3NDBiOWkzaG1ybWoxM3dmNWcifQ.bB-kCl0347BPsc_q-7GIOg",
});
const directionsClient = mbxDirections(baseClient);


const addOrder = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const attr = { ...req.body };
    console.log(attr);

    // const task = await Task.create({
    //   Pickup_from: attr.originAddress,
    //   Deliver_To: attr.destinationAddress,
    //   Instruction: attr.Instruction,
    //   Add_Task_details: attr.Item_Type,
    // });

    let distance;
    await directionsClient
      .getDirections({
        profile: "driving-traffic",
        waypoints: [
          { coordinates: attr.origin },
          { coordinates: attr.destination },
        ],
        geometries: "geojson",
        steps: true,
      })
      .send()
      .then((response) => {
        distance = Math.floor(response.body.routes[0].distance / 1000) * 10;
      });
    var Order_Id = Math.random();
    Order_Id = Order_Id * 100000000;
    Order_Id = parseInt(Order_Id);

    const order_create = moment().format("DD MMMM YYYY, hh:mm A");
    const order = await Order.create({
      user_id: req.user.id,
      Order_Id: Order_Id,
      Pickup_from: attr.originAddress,
      Deliver_To: attr.destinationAddress,
      Instruction: attr.Instruction,
      Item_Type: attr.Item_Type,
      Billing_Details: distance,
      Order_Status: "0",
      Order_Assign: "0",
      Order_Created_time: order_create

    });

    // const data = await Task.findOne({
    //   where: { id: task.id },
    // });

    return res.status(200).json({
      msg: "task created sucessfully",
      task: data,
      order: order,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ Message: "Something Went Wrong" });
  }
};

const getOrdersByStatus = async (req, res) => {
  try {
    const user_id = req.user.id;
    let orders;
    const status = req.params.status;
    switch (true) {

      case status === "0":
        orders = await Order.findAll({
          where: { user_id: user_id, order_status: "0" },
        });
        break;

      case status === "1":
        orders = await Order.findAll({
          where: { user_id: user_id, order_status: "1" },
        });
        break;

      case status === "2":
        orders = await Order.findAll({
          where: { user_id: user_id, order_status: "2" },
        });
        break;

      case status === "3":
        orders = await Order.findAll({
          where: { user_id: user_id, order_status: "3" },
        });
        break;

      default:
        orders = await Order.findAll({ where: { user_id: user_id } });
        // console.log(orders);
        break;
    }

    res.json({ user_id, orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Cancel an order by ID
const cancelOrder = async (req, res) => {
  const user_id = req.user.id;
  const order = await Order.findOne({
    where: { id: req.params.id, user_id: user_id },
  });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  if (order.status === "2" || order.status === "4") {
    return res.status(400).json({ message: "Order cannot be cancelled" });
  }
  order.status = "4";
  await order.save();
  res.json({ user_id, order });
};

module.exports = {
  cancelOrder,
  getOrdersByStatus,
  addOrder,
};
