'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Card.init({
    user_id: DataTypes.INTEGER,
    stripe_card_id: DataTypes.STRING,
    card_no: DataTypes.BIGINT,
    name: DataTypes.STRING,
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    is_default: DataTypes.BOOLEAN

  }, {
    sequelize,
    modelName: 'Card',
  });
  return Card;
};