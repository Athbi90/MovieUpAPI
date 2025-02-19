"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
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

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
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

//Models relations:
//Movie-Review
db.Movie.hasMany(db.Review, {
  foreignKey: "movieID",
});
db.Review.belongsTo(db.Movie, {
  foreignKey: "movieID",
});

//User-Review
db.User.hasMany(db.Review, {
  foreignKey: "userID",
});
db.Review.belongsTo(db.User, {
  foreignKey: "userID",
});

//User-Room
db.User.belongsToMany(db.Room, {
  through: "RoomUser",
  as: "rooms",
  foreignKey: "userID",
});
db.Room.belongsToMany(db.User, {
  through: "RoomUser",
  as: "users",
  foreignKey: "roomID",
});

//Room-Movie
db.Movie.hasMany(db.Room, {
  foreignKey: "movieID",
});
db.Room.belongsTo(db.Movie, {
  foreignKey: "movieID",
});
module.exports = db;
