const express = require("express");
const path = require('path');
//  require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, './env') });

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cron = require("cron");

const deleteUserData = require("./deleteUserData");


var db = require('./models');

const authRoutes = require("./Routes/authRoute");
const orderRoutes = require("./Routes/orderListRoute");
const driverRoutes = require("./Routes/driverRoute");
const profileROute = require('./Routes/profileRoute');
const paymentRoutes = require("./Routes/payment");
const feedbackRoutes = require("./Routes/feedback");
const notificationRoutes = require("./Routes/notification");

const app = express();

app.use('/', express.static(path.join(__dirname, 'Image')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use("/auth", authRoutes);
app.use(orderRoutes);
app.use(driverRoutes);
app.use(profileROute);
app.use("/payment", paymentRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/notification", notificationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT);



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

module.exports = app;
