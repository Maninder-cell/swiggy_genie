'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  task.init({
    Pickup_from: DataTypes.STRING,
    Deliver_To: DataTypes.STRING,
    Add_Task_details: DataTypes.STRING,
    Instruction: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'task',
  });
  return task;
};