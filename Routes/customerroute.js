const express = require('express');
const router = express.Router();

const customerroute=require("../Controllers/CustomerController");

const auth=require('../Middleware/verifyToken');
const validresult=require('../Middleware/validationresult');
const validator=require('../Middleware/validator');



// router.post('/createcutomer',auth,validator.customervalidation,validresult,customerroute.createcustomer);
router.post('/getcustomer',auth,customerroute.getuser);
router.post('/driver',auth,customerroute.createdriver);
// router.post('/driver',auth,customerroute.createdriver);
// router.get('/getdriver/:driver_id?',auth,customerroute.getdriver);
router.post('/getdriver',auth,customerroute.getdriver);
router.post('/order',customerroute.createorder);
// router.get('/getorder/:order_id?',auth,customerroute.getorders);
router.post('/getorder',auth,customerroute.getorders);
router.post('/block',auth,customerroute.isblocked);

module.exports=router;


