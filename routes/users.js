var express = require('express');
var router = express.Router();
const upload = require('../utils/multer');
var authcontroller = require('../controller/authController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/profile',upload.single("image"),authcontroller.profileController);

module.exports = router;
