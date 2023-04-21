const jwt = require("jsonwebtoken");
const models = require("../models");
const { sequelize } = require("../models");
const { validationResult } = require("express-validator");
const User = models.User;

require("dotenv").config();

const register = async (req, res) => {
  try {
      const { PhoneNumber } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //missing fields
      if (!PhoneNumber) {
        return res
          .status(400)
          .json({ success: false, msg: "Please enter all fields" });
      }

      //find user
      const userExists = await User.findOne(
        { where: { PhoneNumber } }
      );

      if (userExists) {
        return res
          .status(400)
          .json({ success: false, msg: "User already exists" });
      }

      const newUser = await User.create(
        {
          phoneNumber: PhoneNumber,
        }
      );
      return res.json(res, 200, {
        success: true,
        msg: "User created successfully",
        data: {
          user_id: newUser.id,
          phoneNumber: newUser.phoneNumber,
        },
      });
  } catch (err) {
    console.log(err);
    return  res
    .status(500)
    .json( {
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { PhoneNumber } = req.body;

    //validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //find user by PhoneNumber
    const user = await User.findOne({ where: { PhoneNumber } });

    if (!user) {
      return res.status(401).json({ message: "Invalid phone number" });
    }

    //generate token
    const token = jwt.sign(
      { phoneNumber: user.phoneNumber, id: user.id, role: user.role },
      process.env.JWT_SECRET,
    //   {
    //     expiresIn: "60m",
    //   }
    );

    return res
      .status(200)
      .json( {
      success: true,
      msg: "User logged in successfully",
      data: {
        user_id: user.id,
        role: user.role,
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

module.exports = {
    login,
    register,
  };
  