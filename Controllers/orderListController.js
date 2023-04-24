const models = require("../models");
const Order = models.Order;
const User = models.User;

const order = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { status } = req.body;

    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Create order
    const order = await Order.create({
      user_id,
      status: status,
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getOrdersByStatus = async (req, res) => {
  try {
    const user_id = req.user.id;
    let orders;

    switch (req.path) {
      case "/orders":
        orders = await Order.findAll({ where: { user_id: user_id } });
        break;
      case "/pending":
        orders = await Order.findAll({
          where: { user_id: user_id, status: "pending" },
        });
        break;
      case "/completed":
        orders = await Order.findAll({
          where: { user_id: user_id, status: "completed" },
        });
        break;
      case "/accepted":
        orders = await Order.findAll({
          where: { user_id: user_id, status: "accepted" },
        });
        break;
      case "/cancelled":
        orders = await Order.findAll({
          where: { user_id: user_id, status: "cancelled" },
        });
        break;
      default:
        return res.status(404).json({ message: "Endpoint not found" });
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
  if (order.status === "completed" || order.status === "cancelled") {
    return res.status(400).json({ message: "Order cannot be cancelled" });
  }
  order.status = "cancelled";
  await order.save();
  res.json({ user_id, order });
};

module.exports = {
  order,
  cancelOrder,
  getOrdersByStatus,
};
