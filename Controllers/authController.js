const jwt = require("jsonwebtoken");
const models = require("../models");
const { validationResult } = require("express-validator");
const User = models.User;

require("dotenv").config();

const register = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //missing fields
    if (!phoneNumber) {
      return res
        .status(400)
        .json({ success: false, msg: "Please enter all fields" });
    }

    //find user
    const userExists = await User.findOne({ where: { Phone:phoneNumber } });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    const newUser = await User.create({
      Phone: phoneNumber,
    });

    //generate token
    const token = jwt.sign(
      { phoneNumber: newUser.Phone, id: newUser.id, role: newUser.account_type },
      process.env.JWT_SECRET,
      {
        expiresIn: "15d",
      }
    );
    // save token in user model
    newUser.tokens = token;
    newUser.lastLoggedIn = Date.now();
    await newUser.save();

        // Set token as cookie
        res.cookie("auth_token", token, {
          maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
          httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
        });
    return res.status(200).json({
      success: true,
      msg: "User created successfully",
      data: {
        user_id: newUser.id,
        Phone: newUser.Phone,
        token: token,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    //validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //find user by PhoneNumber
    const user = await User.findOne({ where: { Phone:phoneNumber } });

    if (!user) {
      return res
        .status(401)
        .json({ message: "User doesn't exist please Signup" });
    }

    //generate token
    const token = jwt.sign(
      { phoneNumber: user.Phone, id: user.id, role: user.account_type },
      process.env.JWT_SECRET,
      {
        expiresIn: "15d",
      }
    );
    // save token in user model
    user.tokens = token;
    user.lastLoggedIn = Date.now();
    await user.save();

    // Set token as cookie
    res.cookie("auth_token", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      msg: "User logged in successfully",
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

const logout = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user = await User.findByPk(user_id);
    if (!user || !user.tokens) {
      return res.status(401).json({ message: "Token not found" });
    }
    user.tokens = null;
    await user.save();

    res.clearCookie("auth_token");

    return res.status(200).json({
      success: true,
      msg: "User logged out successfully",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", err: err.message });
  }
};

module.exports = {
  login,
  register,
  logout,
};
