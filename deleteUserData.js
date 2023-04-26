const { Op } = require("sequelize");
const models = require("./models");
const User = models.User;

const job = async () => {
  // Find users who signed up but didn't log in for 2 days
  const twoDaysAgo = new Date(Date.now() - 60 * 1000);

//   const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const usersToDelete = await User.findAll({
    where: {
      tokens: null,
      lastLoggedIn: null,
      createdAt: {
        [Op.lte]: twoDaysAgo,
      },
    },
  });

  // Delete the user's data
  usersToDelete.forEach(async (user) => {
    await user.destroy();
  });
};

module.exports = job;

// app.js

// const cron = require("cron");
// const deleteUserData = require("./deleteUserData");

// // Setup cron job to delete user data
// const cronJob = new cron.CronJob(
//     "20 11 * * *", // Run every day at 11:15 AM according to India time standard
//     async () => {
//       await deleteUserData(); // Call function to delete user data
//     },
//     null,
//     true,
//     "Asia/Kolkata" // Set timezone to India Standard Time
//   );
  
//   // Start the cron job
//   cronJob.start();
  