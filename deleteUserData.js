const { Op } = require("sequelize");
const models = require("./models");
const User = models.User;

const job = async () => {
  // Find users who signed up but didn't log in for 2 days

  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
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

