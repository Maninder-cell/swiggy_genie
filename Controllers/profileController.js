const models = require("../models");

const User = models.User;

const { validationResult } = require("express-validator");

exports.editprofileController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const updatedUser = {...req.body};
      const find = await User.findByPk((req.user.id));
      if (!find) {
        return res.status(201).json({ Message:"User Not Found" });
      } else {
        const user = await find.update(updatedUser,{returning: true, attributes: ['Name','photoUri','Address','Email','Phone','status']});
        return res.status(201).json({ user,Message:"User Updated Sucessfully" });
      }
    } catch (error) {
      console.error(error);
      return res.status(400).json({ Message: "Something Went Wrong" });
    }
  };