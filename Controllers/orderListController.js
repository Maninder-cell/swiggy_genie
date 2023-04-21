const models = require('../models');
const Order = models.Order;
const User = models.User;

const order=async (req, res) => {
    try {
     const user_id= req.user.id;
      const {status } = req.body;

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
  }

// Get all orders
const getAll = async (req, res) => {
    const user_id= req.user.id;
    const orders = await Order.findAll({ where: { user_id: user_id } });
    res.json({user_id,orders});
};

// Get all pending orders
const pending = async (req, res) => {
    const user_id= req.user.id;

  const orders = await Order.findAll({ where: {user_id: user_id , status: 'pending' } });
  res.json({user_id,orders});
};

// Get all completed orders
const completed= async (req, res) => {
    const user_id= req.user.id;
  const orders = await Order.findAll({ where: {user_id: user_id , status: 'completed' } });
  res.json({user_id,orders});
};

// Get all accepted orders
const accepted= async (req, res) => {
    const user_id= req.user.id;

  const orders = await Order.findAll({ where: {user_id: user_id , status: 'accepted' } });
  res.json({user_id,orders});
};

// Get all cancelled orders
const cancelled= async (req, res) => {
    const user_id= req.user.id;

  const orders = await Order.findAll({ where: {user_id: user_id , status: 'cancelled' } });
  res.json({user_id,orders});
};

// Cancel an order by ID
const cancelOrder= async (req, res) => {
    const user_id= req.user.id;
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: user_id },
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status === 'completed' || order.status === 'cancelled') {
    return res.status(400).json({ message: 'Order cannot be cancelled' });
  }
  order.status = 'cancelled';
  await order.save();
  res.json({user_id,order});
};

module.exports ={
    getAll,
    cancelled,
    cancelOrder,
    pending,
    completed,
    accepted,
    order
}
