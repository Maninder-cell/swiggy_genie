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

      Order.belongsTo(models.User, { foreignKey: 'user_id' }, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });

      // Order.hasMany(models.User_fcmtoken, { foreignKey: 'user_id' }, {
      //   onDelete: "CASCADE",
      //   onUpdate: "CASCADE"
      // });

      // Order.hasOne(models.OrderStatus, { foreignKey: 'Order_Id' }, {
      //   onDelete: "CASCADE",
      //   onUpdate: "CASCADE"
      // });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    order_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    driver_id: DataTypes.INTEGER,
    pickup_from: DataTypes.STRING,
    deliver_to: DataTypes.STRING,
    item_type: DataTypes.STRING,
    billing_details: DataTypes.INTEGER,
    instruction: DataTypes.STRING,
    order_created_time: DataTypes.STRING,
    order_completed_time: DataTypes.STRING,
    order_status: {
      type: DataTypes.STRING,
      comment: "0->Pending\n1->Accepted\n2->Completed",
    },
    order_assign: {
      type: DataTypes.STRING,
      comment: "0->No-Assign\n1->Assign",
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};