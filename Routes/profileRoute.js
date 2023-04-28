const router = require("express").Router();

const verifyToken = require("../Middleware/verifyToken");

const profileController = require("../Controllers/profileController");

router.patch('/update',profileController.editprofileController);

module.exports = router;