const jwt = require("jsonwebtoken");
const models = require("../models");
const { validationResult } = require("express-validator");
const User = models.User;
const User_fcmtoken = models.User_fcmtoken;
const moment = require('moment');

require("dotenv").config();

//Check Api to check the number is already registered or not
module.exports.Checkuser = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const userExists = await User.findOne({ where: { Phone: phoneNumber } });
  if (userExists) {
    return res
      .status(400)
      .json({ success: false, msg: "Number already exists" });
  }
  else {
    return res.status(200).json({ msg: "Success" });
  }
}

//Register for User 
module.exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber, CallingCode } = req.body;
    //missing fields
    if (!phoneNumber) {
      return res.status(400).json({ success: false, msg: "Please enter all fields" });
    }

    const newUser = await User.create({
      calling_code: CallingCode,
      phone: phoneNumber,
      account_type: "2"
    });

    //generate token
    const token = jwt.sign(
      { phoneNumber: newUser.Phone, id: newUser.id, role: newUser.account_type },
      "dbdad61f0eab1aded7bd4b43edd7", { expiresIn: "15d", });

    // save token in user model
    newUser.tokens = token;
    newUser.last_logged_in = moment().format("DD MMMM YYYY, hh:mm A");
    await newUser.save();

    // Set token as cookie
    res.cookie("auth_token", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      msg: "User Created Successfully",
      data: newUser
    });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Login for User
module.exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber } = req.body;
    //find user by PhoneNumber
    const user = await User.findOne({ where: { phone: phoneNumber, account_type: "2" } });
    //if user not found
    if (!user) {
      return res
        .status(401)
        .json({ message: "User doesn't exist please Signup" });
    }
    //generate token
    const token = jwt.sign(
      { id: user.id, role: user.account_type },
      "dbdad61f0eab1aded7bd4b43edd7",
      {
        expiresIn: "15d",
      }
    );
    // save token in user model
    const last_logged_in = moment().format("DD MMMM YYYY, hh:mm A");
    user.tokens = token;
    user.last_logged_in = last_logged_in;
    await user.save();
    // Set token as cookie
    res.cookie("auth_token", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true,
    });
    return res.status(200).json({
      success: true,
      msg: "Customer Logged In Successfully",
      data: {
        user_id: user.id,
        role: user.account_type,
        token: token,
      },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", err: err.message });
  }
};

//Login Driver
module.exports.loginDriver = async (req, res) => {
  try {
    //validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { phoneNumber } = req.body;
    //find user by PhoneNumber
    const user = await User.findOne({ where: { phone: phoneNumber, account_type: "1" } });

    //if Driver not found
    if (!user) {
      return res.status(401).json({ message: "You are not authorized" });
    }
    //generate token
    const token = jwt.sign(
      { id: user.id, role: user.account_type },
      "dbdad61f0eab1aded7bd4b43edd7",
      {
        expiresIn: "15d",
      }
    );
    // save token in user model
    const last_logged_in = moment().format("DD MMMM YYYY, hh:mm A");
    user.tokens = token;
    user.last_logged_in = last_logged_in;
    await user.save();
    // Set token as cookie
    res.cookie("auth_token", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      msg: "Driver Logged In Successfully",
      data: { user_id: user.id, role: user.account_type }
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err: err.message });
  }
};

//Log out both for driver and user
module.exports.logout = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user = await User.findByPk(user_id);

    if (!user || !user.tokens) {
      return res.status(404).json({ message: "Token not found" });
    }
    user.tokens = null;
    await user.save();

    //User fcmtoken delete in User_fcmtoken table
    const fcmtoken = User_fcmtoken.destroy({
      where: { user_id: req.user.id }
    }).then(() => {
      console.log('Record deleted successfully');
    }).catch((error) => {
      console.error('Error deleting record: ', error);
    });
    // await User_fcmtoken.save();
    res.clearCookie("auth_token");

    return res.status(200).json({
      success: true,
      msg: "User Logged Out Successfully",
      fcmtoken: "FcmToken Deleted Successfully"
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err: err.message });
  }
};
