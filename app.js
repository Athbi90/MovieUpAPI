const express = require("express");
const path = require("path");
const cors = require("cors");
const ip = require("ip");
const db = require("./db/models");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middlewares/passport");

// Importing Routers
const reviewRouters = require("./db/RoutersAndControllers/Review/routers");
const roomRouters = require("./db/RoutersAndControllers/Room/routers");
const userRouters = require("./db/RoutersAndControllers/User/userRoutes");
const movieRouters = require("./db/RoutersAndControllers/Movie/movieRoutes");

// init app
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);
app.use("/media", express.static(path.join(__dirname, "./media")));

// Routers app use
app.use("/", userRouters);
app.use("/rooms", roomRouters);
app.use("/movies", movieRouters);
app.use("/", reviewRouters); // movies as path ***

// Errors handler middlewre
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Servier Error" });
});

// start server
const runApp = async () => {
  try {
    // await db.sequelize.sync({ alter: true });
    await db.sequelize.sync();

    app.listen(process.env.PORT, () => {
      console.log("Connection to the database was successful!");
      console.log(`Running on ${ip.address()}:${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server:", error);
  }
};

runApp();

module.exports = app;
