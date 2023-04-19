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
    return res.status(400).json({Message:"Something Went Wrong"});
  }
};

exports.profileController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { account_type,Name,Email,Phone,Address, } = req.body;
    
    const file = req.file;

    if (!account_type || !Name || !Email || !Phone || !Address || !file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (file.mimetype.startsWith("image/")!== true){
      return res.status(400).json({ message: "Please Upload image only" });
    }

    const user = await User.create({
      Name,
      Email,
      Phone,
      Address,
      account_type,
      path: file.path
    });

    const accessToken = generateToken({ user });

    return res.status(201).json({ user, accessToken})
  } catch (error) {
    console.error(error);
    return res.status(400).json({Message:"Something Went Wrong"});
  }
};
