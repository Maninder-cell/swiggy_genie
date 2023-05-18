const express = require('express');
const router = express.Router();
const logincontroller = require('../Controllers/loginController');
const auth = require('../Middleware/verifyToken');
const validresult = require('../Middleware/validationresult');
// const validator = require('../Middleware/validator');

router.post('/admin/signup', logincontroller.signup);

router.post('/login',   logincontroller.login);

// router.post('/forgotpass', logincontroller.forgotpassword);

// router.post('/resetpass',  logincontroller.resetpassword);

module.exports = router;