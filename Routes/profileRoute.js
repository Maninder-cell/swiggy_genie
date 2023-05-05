const router = require("express").Router();

const verifyToken = require("../Middleware/verifyToken");

const profileController = require("../Controllers/profileController");

router.patch("/update", verifyToken, profileController.editprofileController);

router.get("/get", verifyToken, profileController.getProfileController);

router.post("/fcmtoken", verifyToken, profileController.saveFcmTokenController);

module.exports = router;
