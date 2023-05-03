'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class taskCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.taskCategory.belongsTo(models.task),
      models.taskCategory.belongsTo(models.categories)
    }
  }
  taskCategory.init({},{
    sequelize,
    modelName: 'taskCategory',
  });
  return taskCategory;
};