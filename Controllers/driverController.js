const models = require("../models");
const { validationResult } = require("express-validator");
const moment = require("moment");
const Order = models.Order;


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
        break;
    }

    res.json({ user_id, orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getOrdersByStatus,
};
