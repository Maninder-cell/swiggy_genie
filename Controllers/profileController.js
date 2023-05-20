const { where } = require("sequelize");
const models = require("../models");
const User_fcmtoken = models.User_fcmtoken;
const User = models.User;

const { validationResult } = require("express-validator");

module.exports.editprofileController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const find = await User.findByPk(req.user.id);
    console.log(req.body);
    console.log('nameeeeeeeee', req.file);

    const user = await find.update({
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      photo_uri: req.file.filename,
    });
    return res.status(201).json({ user, Message: "User Updated Sucessfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ Message: "Something Went Wrong" });
  }
};


module.exports.getProfileController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const find = await User.findOne({ where: { id: req.user.id }, attributes: ['name', 'photo_uri', 'address', 'email', 'phone', 'status', 'id'] });
    return res.status(200).json({ Message: "User", find });

  } catch (error) {
    console.error(error);
    return res.status(400).json({ Message: "Something Went Wrong" });
  }
};

