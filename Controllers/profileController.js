const { where } = require("sequelize");
const models = require("../models");
const User_fcmtoken = models.User_fcmtoken;
const User = models.User;

const { validationResult } = require("express-validator");

exports.editprofileController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const updatedUser = { ...req.body };
    console.log(updatedUser);
    // const find = await User.findOne({where:{Phone:updatedUser.Phone}});
    const find = await User.findByPk(req.user.id);
    if (!find) {
      const user = await User.create(updatedUser);
      return res.status(201).json({ user, Message: "User Created Sucessfully" });
    } else 
    {
      const user = await find.update(updatedUser, {
        returning: true,
        attributes: ["name", "photo_uri", "address", "email", "phone", "status"],
      });
      return res.status(201).json({ user, Message: "User Updated Sucessfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ Message: "Something Went Wrong" });
  }
};


exports.getProfileController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // const updatedUser = {...req.body};
    const find = await User.findOne({ where: { id: req.user.id }, attributes: ['name', 'photo_uri', 'address', 'email', 'phone', 'status', 'id'] });
    return res.status(200).json({ Message: "User", find });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ Message: "Something Went Wrong" });
  }
};


exports.saveFcmTokenController = async (req, res, next) => {
  const fcmtoken = req.body.fcmtoken;
  if (fcmtoken) {
    const check = await User_fcmtoken.findOne({ where: { fcmtoken: fcmtoken, user_id: req.user.id } })
    if (!check) {
      await User_fcmtoken.create({
        user_id: req.user.id,
        fcmtoken: fcmtoken,
      })
    }
  }
  return true;
}