'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.User,{foreignKey: "user_id",as:'customer'});
      Payment.belongsTo(models.Order,{foreignKey: "order_id"});
    }
  }
  Payment.init({
    user_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    paid:{
      type:DataTypes.INTEGER,
      comment: "0->pending\n1->paid"
    },
    stripe_payment_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};