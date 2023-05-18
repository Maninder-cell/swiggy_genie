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

      Order.hasMany(models.DriverAcceptReject, { foreignKey: 'order_id', targetKey: 'order_id' }, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    driver_id: {
      type: DataTypes.INTEGER,
      comment: "0->NoDriver\n1->DriverAssigned"
    },
    pickup_from: DataTypes.STRING,
    deliver_to: DataTypes.STRING,
    billing_details: DataTypes.INTEGER,
    instruction: DataTypes.STRING,
    order_created_time: DataTypes.STRING,
    order_completed_time: DataTypes.STRING,
    category_item_type: DataTypes.JSON,
    order_status: {
      type: DataTypes.STRING,
      comment: "0->Pending\n1->Accepted\n2->Completed\n3->Cancelled",
    },
    order_assign: {
      type: DataTypes.STRING,
      comment: "0->No-Assign\n1->Assign",
    },
    pickup_latitude: DataTypes.STRING,
    pickup_longitude: DataTypes.STRING,
    delivery_latitude: DataTypes.STRING,
    delivery_longitude: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};