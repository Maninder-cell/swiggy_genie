const models = require('../models');
const Order = models.Order;

const getCompletedOrdersCount = async (req, res) => {
  try {

    // const  user_id = req.user.id;
    const completedOrdersCount = await Order.count({
      where: { status: 'completed' }
    });

    const currentDate = new Date().toLocaleDateString();

    return res.status(200).json({
      success: true,
      message: `There have been ${completedOrdersCount} completed orders as of ${currentDate}.`,
      data: {
        completedOrdersCount,
        currentDate
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
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
        case "/rejected":
          orders = await Order.findAll({
            where: { user_id: user_id, status: "rejected" },
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
  




module.exports={
    getCompletedOrdersCount,
    getOrdersByStatus
}