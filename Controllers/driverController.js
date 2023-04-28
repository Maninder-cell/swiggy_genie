const models = require('../models');
const Order = models.Order;
const User = models.User;

const getOrdersByStatus = async (req, res) => {
  try {
    const user_id = req.user.id;
    let orders;
    const status = { ...req.body };
    switch (true) {
      case status.status === "0":
        orders = await Order.findAll({
          where: { user_id: user_id, status: "0" },
        });
        break;
      case status.status === "2":
        orders = await Order.findAll({
          where: { user_id: user_id, status: "2" },
        });
        break;
      case status.status === "1":
        orders = await Order.findAll({
          where: { user_id: user_id, status: "1" },
        });
        break;
      case status.status === "3":
        orders = await Order.findAll({
          where: { user_id: user_id, status: "3" },
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

const actionController = async (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const order = { ...req.body };
    const update = await Order.findOne({
      where: { OrderId: parseInt(order.OrderId) },
    });
    switch (true) {
      case update.status === "0":
        if (order.status !== "3" && order.status !== "4") {
          (update.status = order.status),
            (update.DriverId = req.user.id),
            await update.save();
          return res.json({ Message: "Accepted Sucessfully" });
        } else {
          (update.status = "0"), (update.DriverId = null), await update.save();
          return res.json({ Message: "Rejected Sucessfully" });
        }
      case update.status === "1" && update.DriverId === req.user.id:
        if (order.status !== "3" && order.status !== "4") {
          (update.status = order.status), await update.save();
          return res.json({ Message: "Updated Sucessfully" });
        } else {
          (update.status = "0"), (update.DriverId = null), await update.save();
          return res.json({
            Message: "You've Sucessfully Rejected Your Order",
          });
        }
      case update.status === "3":
        if (order.status !== "3" && order.status !== "4") {
          (update.status = order.status),
            (update.DriverId = req.user.id),
            await update.save();
          return res.json({ Message: "Accepted Sucessfully" });
        } else {
          (update.status = "0"), (update.DriverId = null), await update.save();
          return res.json({ Message: "Rejected Sucessfully" });
        }

      case update.status === "2":
        return res.json({ Message: "Already delivered" });
      case update.status === "4":
        return res.json({ Message: "Cancelled by user" });

      default:
        return res.json({ Message: "Already Accepted" });
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json({ Message: "Something Went Wrong" });
  }
};


module.exports={
    getCompletedOrdersCount,
    getOrdersByStatus
}