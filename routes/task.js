const router = require("express").Router();
const upload = require("../utils/multer");
const role = require('../middleware/requireUser');
var taskcontroller = require("../controller/taskController");

router.post(
  "/upload-amenity",
  upload.array("amenity"),
  taskcontroller.addAmenity
);

router.get("/get-amenity", taskcontroller.getAmenities);

router.delete("/delete-amenity/:amenity_id", taskcontroller.deleteAmenities);

router.post("/addtask", taskcontroller.addOrder);

// router.post("/distance", taskcontroller.distance);

router.patch('/feedback/:orderId',role.role,taskcontroller.feedback);

// router.get('/order',role.role,taskcontroller.getOrder);
router.get('/order',taskcontroller.getOrder);

module.exports = router;
