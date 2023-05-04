'use strict';
const {
  Model
} = require('sequelize');
// const { v4: uuidv4 } = require('uuid');

const ROLE = {
  ADMIN: 0,
  DRIVER: 1,
  CUSTOMER: 2,
};

const STATUS = {
  OFF: 0,
  ON: 1,
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
      User.hasMany(models.Order, { foreignKey: 'user_id' }, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });

      // User.hasMany(models.User_fcmtoken, { foreignKey: 'user_id' }, {
      //   onDelete: "CASCADE",
      //   onUpdate: "CASCADE"
      // });
    }
  }
  User.init({
    CallingCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Phone: {
      type: DataTypes.BIGINT,
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
      type: DataTypes.ENUM(['0', '1','2']),
      defaultValue: ROLE.CUSTOMER,
      allowNull: true,
      comment: "0->Admin\n1->Driver\n2->Customer",
    },
    block: {
      type: DataTypes.ENUM(['0', '1']),
      comment: "0->active\n1->block"
    },
    latitude: {
      type: DataTypes.DECIMAL
    },
    longitude: {
      type: DataTypes.DECIMAL
    },
    tokens: {
      type: DataTypes.STRING
    },
    stripe_id: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: STATUS.OFF,
      allowNull: true,
      commnet: "0->Off\n1->On",
    },
    photoUri: DataTypes.STRING,
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