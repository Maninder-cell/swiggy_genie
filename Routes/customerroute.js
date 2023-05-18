const express = require('express');
const router = express.Router();

const customeroute = require("../Controllers/CustomerController");

const auth = require('../Middleware/verifyToken');

router.post('/getcustomer', auth, customeroute.getuser);
router.post('/driver', auth, customeroute.createdriver);
router.post('/getdriver', auth, customeroute.getdriver);
router.post('/getorder', auth, customeroute.getorders);
router.post('/block', auth, customeroute.isblocked);
router.post('/getpayment', auth, customeroute.getpayment);

module.exports = router;

