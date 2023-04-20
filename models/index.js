"use strict";

const fs = require("fs");
const path = require("path");
const {Sequelize, DataTypes} = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

sequelize
  .authenticate()
  .then(function (err) {
    console.log("Connection has been established successfully.");
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err.message);
  });

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = require('./user')(sequelize,DataTypes);
db.amenity = require('./amenity')(sequelize,DataTypes);
db.task = require('./task')(sequelize,DataTypes);
db.order_details = require('./order_details')(sequelize,DataTypes);
db.taskAmenity = require('./taskamenity')(sequelize,DataTypes);
db.sequelize.sync({alter:true});

db.amenity.belongsToMany(db.task, {
  through: db.taskAmenity,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.task.belongsToMany(db.amenity, {
  through: db.taskAmenity,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = db;
