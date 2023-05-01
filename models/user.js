'use strict';
const {
  Model
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const ROLE = {
  ADMIN: 0,
  DRIVER: 1,
  CUSTOMER: 2,
};

const STATUS={
  OFF:0,
  ON:1,
};

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Order, {
        foreignKey: 'user_id',
        onDelete: "CASCADE",

      });

      // models.User.hasMany(models.task, {
      //   foreignKey: 'user_id',
      //   onDelete: "CASCADE",

      // });

      // models.User.belongsTo(models.Payment, {
      //   foreignKey: 'user_id',
      //         onDelete: "CASCADE",
      // });

      // models.User.belongsTo(models.Feedback, {
      //   foreignKey: 'user_id',
      // onDelete: "CASCADE",
      // });
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Name: DataTypes.STRING,
    Email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    account_type: {
      type: DataTypes.INTEGER,
      defaultValue: ROLE.CUSTOMER,
      allowNull: true,
      comment: "0: admin, 1: driver, 2: customer",

    },
    tokens: {
      type: DataTypes.STRING
    } ,
    status:{
    type:DataTypes.INTEGER,
    defaultValue:STATUS.OFF,
    allowNull:true,
    commnet:"0:off , 1:on",
  } ,
  photoUri:DataTypes.STRING,
  lastLoggedIn: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Timestamp of last login"
  }
}, {
    sequelize,
    modelName: 'User',
  });
  return User;
};