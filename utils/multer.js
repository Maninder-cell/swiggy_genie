const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + "-" + file.originalname);
    // cb(null, uniqueSuffix + "-" + file.originalname);
    cb(null, file.originalname)
  },
});

const upload = multer({ storage: fileStorage });

module.exports = upload;
