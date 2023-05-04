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
    Order_Id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    Driver_Id: DataTypes.INTEGER,
    Pickup_from: DataTypes.STRING,
    Deliver_To: DataTypes.STRING,
    Item_Type: DataTypes.STRING,
    Billing_Details: DataTypes.INTEGER,
    Instruction: DataTypes.STRING,
    Order_Created_time: DataTypes.STRING,
    Order_Completed_time: DataTypes.STRING,
    Order_Status: {
      type: DataTypes.STRING,
      comment: "0->Pending\n1->Accepted\n2->Completed",
    },
    Order_Assign: {
      type: DataTypes.STRING,
      comment: "0->No-Assign\n1->Assign",
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};