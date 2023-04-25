const router = require("express").Router();
const upload = require("../utils/multer");
const role = require('../middleware/requireUser');
var authcontroller = require("../controller/authController");
const {body} = require('express-validator');

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// router.post(
//   "/profile",
//   upload.single("photoUri"),
//   authcontroller.profileController
// );

router.post(
  "/profile",body("Name").isString(),body("Email").isEmail(),body("Phone").isMobilePhone(),body('Address').isString(),authcontroller.profileController
);

router.patch('/update',authcontroller.editprofileController);

router.get('/get',authcontroller.getProfileController);

module.exports = router;
