'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Order.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: "CASCADE",
      });
    }
  }
  Order.init({
    Pickup_from: DataTypes.STRING,
    Deliver_To: DataTypes.STRING,
    Item_Type: DataTypes.STRING,
    Billing_Details: DataTypes.INTEGER,
    Instruction: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM(['0', '1', '2', '3', '4']),
      comment: "0->Pending\n1->Accepted\n2->completed\n3->Rejected\n4->Cancelled",
    },
    user_id: DataTypes.INTEGER,
    OrderNo: DataTypes.INTEGER
     }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};