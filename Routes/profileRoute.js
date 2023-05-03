const router = require("express").Router();
const upload = require("../utils/multer");

const verifyToken = require("../Middleware/verifyToken");

const profileController = require("../Controllers/profileController");

router.patch(
  "/update",
  upload.single(),verifyToken,
  profileController.editprofileController
);

// router.patch("/update", verifyToken, profileController.editprofileController);

router.get("/get", verifyToken, profileController.getProfileController);

module.exports = router;
