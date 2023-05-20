const express = require('express');
const router = express.Router();
const path = require('path')
const multer = require('multer');

const customeroute = require("../Controllers/CustomerController");

const auth = require('../Middleware/verifyToken');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, '../Image');
        cb(null, path.join(__dirname, '../Image'));
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: fileStorage, fileFilter: fileFilter });


router.post('/getcustomer', customeroute.getuser);
router.post('/block', customeroute.block);
router.post('/driver/signup', upload.single('photo_uri'), customeroute.createdriver);
router.post('/getdriver', customeroute.getdriver);
router.post('/getorder', customeroute.getorders);
router.post('/getpayment', customeroute.getpayment);

module.exports = router;

