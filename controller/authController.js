const db = require("../models");

const User = db.user;

const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");

const generateToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

exports.registerController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { account_type,Name,Email,Phone,Address, } = req.body;

    if (!account_type || Name || Email || Phone || Address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.create({
      Name,
      Email,
      Phone,
      Address,
      account_type,
    });

    const accessToken = generateToken({ user });
    console.log(accessToken);

    return res.status(201).json({ user, accessToken})
  } catch (error) {
    console.error(error);
  }
};
