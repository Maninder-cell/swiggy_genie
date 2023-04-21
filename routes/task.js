const router = require("express").Router();
const upload = require("../utils/multer");
var taskcontroller = require("../controller/taskController");

router.post(
  "/upload-amenity",
  upload.array("amenity"),
  taskcontroller.addAmenity
);

router.get("/get-amenity", taskcontroller.getAmenities);

router.delete("/delete-amenity", taskcontroller.deleteAmenities);

router.post("/addtask", taskcontroller.addOrder);

router.post("/distance", taskcontroller.distance);

router.patch('/feedback',taskcontroller.feedback);

module.exports = router;
