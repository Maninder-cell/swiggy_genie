var express = require('express');
var router = express.Router();
var authcontroller = require('../controller/authController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',authcontroller.registerController);

module.exports = router;
