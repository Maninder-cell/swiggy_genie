const models = require("../models");
const Order = models.Order;
const Category = models.Category;
const User = models.User;
const TaskDetails = models.TaskDetails;
// const OrderCategory = models.OrderCategory;

// const OrderStatus = models.OrderStatus;
const moment = require('moment');
const { validationResult } = require("express-validator");
const mbxClient = require("@mapbox/mapbox-sdk");
const mbxDirections = require("@mapbox/mapbox-sdk/services/directions");
const baseClient = mbxClient({
  accessToken:
    "pk.eyJ1IjoibmF1c2hhZGlhIiwiYSI6ImNsZ296eXA3NDBiOWkzaG1ybWoxM3dmNWcifQ.bB-kCl0347BPsc_q-7GIOg",
});
// const directionsClient = mbxDirections(baseClient);

const addtask = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
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

    return res.status(200).json({
      msg: "order task sucessfully",
      order: task,
    });
  }
  catch (err) {
    console.log(err);
    return res.status(200).json({ Message: "Something Went Wrong" });
  }

};

const getask = async (req, res, next) => {
  try {
    const task = await TaskDetails.findOne({
      limit: 1,
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    })
    const taskupdate = await task.update({
      billing_details: 1220,
    })
    res.json({ taskupdate, msg: "Order Get Successfully" });
  }
  catch {

  }
}

const addOrder = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const attr = { ...req.body };
    console.log(attr);

    // let distance;
    // await directionsClient
    //   .getDirections({
    //     profile: "driving-traffic",
    //     waypoints: [
    //       { coordinates: attr.origin },
    //       { coordinates: attr.destination },
    //     ],
    //     geometries: "geojson",
    //     steps: true,
    //   })
    //   .send()
    //   .then((response) => {
    //     distance = Math.floor(response.body.routes[0].distance / 1000) * 10;
    //   });
    var Order_Id = Math.random();
    Order_Id = Order_Id * 100000000;
    Order_Id = parseInt(Order_Id);

    const order_create = moment().format("DD MMMM YYYY, hh:mm A");
    const order = await Order.create({
      user_id: req.user.id,
      order_id: Order_Id,
      driver_id: "0",
      pickup_from: attr.pickup_from,
      deliver_to: attr.deliver_to,
      instruction: attr.Instruction,
      category_item_type: "Food Item",
      billing_details: attr.billing_details,
      order_status: "0",
      order_assign: "0",
      pickup_latitude: attr.pickup_latitude,
      pickup_longitude: attr.pickup_longitude,
      delivery_latitude: attr.delivery_latitude,
      delivery_longitude: attr.delivery_longitude,
      order_created_time: order_create,
    });


    // const ordercategory = OrderCategory.findOne({
    //   where: { order_id },
    //   order: [['createdAt', 'DESC']],
    // })
    // const data = await Task.findOne({
    //   where: { id: task.id },
    // });

    return res.status(200).json({
      msg: "order created sucessfully",
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
  console.log(req.params.id);
  const order = await Order.findOne({
    where: { order_id: req.params.id },
  });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  if (order.order_status == "1" || order.order_status == "0") {
    const orderCancel = await order.update({
      order_status: "3",
    });
    return res.json({ msg: orderCancel });
  };
  return res.json({ msg: "Cannot be cancelled" });
}

const getCategory = async (req, res) => {
  try {
    const category = await Category.findAll({
      attributes: ['id', 'name', 'path', 'icon_name']
    });
    res.json({ data: category });
    // console.log(category[0].path);

  }
  catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}


const AddCategory = async (req, res) => {
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


module.exports = {
  AddCategory,
  getCategory,
  // CategoryOrder,
  cancelOrder,
  getask,
  getOrdersByStatus,
  addOrder,
  addtask
};
