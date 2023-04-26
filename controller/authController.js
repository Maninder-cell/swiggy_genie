const db = require("../models");

const User = db.user;

const jwt = require("jsonwebtoken");
const store = require('store2');

const { validationResult } = require("express-validator");

const generateToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    console.log(error);
    return res.status(400).json({ Message: "Something Went Wrong" });
  }
};

exports.local = async(req, res) => {
  console.log(store.getAll());
  return res.status(200).json({Message:"Local Get Sucessfully"})
}

exports.editprofileController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const updatedUser = {...req.body};
    const find = await User.findOne({where:{Phone:updatedUser.Phone}});
    if (!find) {
      const user = await User.create(updatedUser);
      const accessToken = generateToken({ id:user.id,account_type:user.account_type });
      return res.status(201).json({ user,accessToken,Message:"User Created Sucessfully" });
    } else {
      const user = await find.update(updatedUser,{returning: true, attributes: ['Name','photoUri','Address','Email','Phone']});
      const accessToken = generateToken({ id:user.id,account_type:user.account_type });
      store.set('token',accessToken);
      console.log(store.get('token'));
      return res.status(201).json({ user,accessToken,Message:"User Updated Sucessfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ Message: "Something Went Wrong" });
  }
};

exports.profileController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const profile = {...req.body};
    // const { account_type, Name, Email, Phone, Address } = req.body;

    // const file = req.file;
    // console.log(file);

    // if (!Name || !Email || !Phone || !Address || !file || !account_type) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }

    // const oldUser = await User.findOne({ where: { Email } });
    // if (oldUser) {
    //   return res.status(400).json({ Message: "User is already registered" });
    // }

    // if (file.mimetype.startsWith("image/") !== true) {
    //   return res.status(400).json({ message: "Please Upload image only" });
    // }

    // const user = await User.create({
    //   Name,
    //   Email,
    //   Phone,
    //   Address,
    //   account_type,
    //   path: file.path,
    // });

    const user = await User.create(profile);
    const accessToken = generateToken({ user });

    return res.status(201).json({ user, accessToken });
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
    const find = await User.findAll({attributes: ['Name','photoUri','Address','Email','Phone']});
    console.log(find);
    return res.status(200).json({Message:"User",find});
  } catch (error) {
    console.error(error);
    return res.status(400).json({ Message: "Something Went Wrong" });
  }
};
