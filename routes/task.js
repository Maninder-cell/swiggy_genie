const router = require("express").Router();
const upload = require('../utils/multer');
var taskcontroller = require('../controller/taskController');

router.post('/upload-amenity',upload.array("amenity"),taskcontroller.addAmenity);

router.post('/get-amenity',taskcontroller.getAmenities)

module.exports = router;

