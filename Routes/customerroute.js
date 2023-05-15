const express = require('express');
const router = express.Router();

const customerroute = require("../Controllers/CustomerController");

// const auth = require('../Middleware/verifyToken');

router.post('/getcustomer', customerroute.getuser);
router.post('/driver', customerroute.createdriver);
router.post('/getdriver', customerroute.getdriver);
router.post('/getorder', customerroute.getorders);
router.post('/block', customerroute.isblocked);
router.post('/getpayment', customerroute.getpayment);

module.exports = router;

