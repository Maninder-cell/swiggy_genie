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
    console.log(req.body);
    console.log('nameeeeeeeee', req.file);
    // return res.json(req.user.id)
    if (!req.file) {
      return res.status(400).json({ message: 'file is required' })
    }

    const user = await User.update({
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      photo_uri: req.file.filename,
    }, { where: { id: req.user.id } });

    const find = await User.findByPk(req.user.id);

    return res.status(201).json({ user: find, Message: "User Updated Sucessfully", is_update: user });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ Message: "Something Went Wrong" });
  }
};


module.exports.getonlyphoto = async (req, res) => {
  try {
    const data = req.file.filename;
    const user = await User.findByPk(req.user.id);

    const update = await user.update({
      photo_uri: data
    })
    return res.status(200).json({ msg: "User photo updated Successfully", update });

  } catch (error) {
    console.error(error);
    return res.status(400).json({ Message: "Something Went Wrong" });
  }
}

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

