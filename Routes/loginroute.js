const express = require('express');
const router = express.Router();
const logincontroller = require('../Controllers/loginController');
const auth = require('../Middleware/verifyToken');
const validresult = require('../Middleware/validationresult');
const validator = require('../Middleware/validator');

router.post('/login', validator.loginvalidation, validresult, logincontroller.login);

router.post('/forgotpass', logincontroller.forgotpassword);

router.post('/resetpass', auth, validator.resetpassvalid, validresult, logincontroller.resetpassword);

module.exports = router;