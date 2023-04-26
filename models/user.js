'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    Name: DataTypes.STRING,
    Email: DataTypes.STRING,
    Phone: DataTypes.STRING,
    Address: DataTypes.STRING,
    account_type: {
      type: DataTypes.ENUM(['0', '1']),
      comment: "0->Customer\n1->Driver"
    },
    status: {
      type: DataTypes.ENUM(['0', '1']),
      comment: "0->Off\n1->On"
    },
    photoUri:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};