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
    user_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'completed', 'cancelled'),
      defaultValue: 'pending'
    }  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};