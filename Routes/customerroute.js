const express = require('express');
const router = express.Router();

const customerroute=require("../Controllers/CustomerController");

const auth=require('../Middleware/verifyToken');
const validresult=require('../Middleware/validationresult');
const validator=require('../Middleware/validator');




router.post('/getcustomer',auth,customerroute.getuser);
router.post('/driver',auth,customerroute.createdriver);
router.post('/getdriver',auth,customerroute.getdriver);
router.post('/getorder',auth,customerroute.getorders);
router.post('/block',auth,customerroute.isblocked);
router.post('/getpayment',auth,customerroute.getpayment);

module.exports=router;


