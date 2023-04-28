const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/authRoute");
const orderRoutes = require("./Routes/oderListRoute");
const driverRoutes = require("./Routes/driverRoute");
const path = require('path');
const cookieParser = require('cookie-parser');

const cron = require("cron");
const deleteUserData = require("./deleteUserData");
const config = require('config');
require("dotenv").config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use(orderRoutes);
app.use(driverRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));

// Setup cron job to delete user data
const cronJob = new cron.CronJob(
    "37 11 * * *", // Run every day at 11:15 AM according to India time standard
    async () => {
      await deleteUserData(); // Call function to delete user data
    },
    null,
    true,
    "Asia/Kolkata" // Set timezone to India Standard Time
  );
  
  // Start the cron job
  cronJob.start();
