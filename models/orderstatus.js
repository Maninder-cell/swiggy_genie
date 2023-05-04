'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // OrderStatus.belongsTo(models.Order, { foreignKey: 'Order_Id' }, {
      //   onDelete: "CASCADE",
      //   onUpdate: "CASCADE"
      // });
    }
  }
  OrderStatus.init({
    Order_Id: DataTypes.INTEGER,
    Driver_Id: DataTypes.INTEGER,
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
    modelName: 'OrderStatus',
  });
  return OrderStatus;
};