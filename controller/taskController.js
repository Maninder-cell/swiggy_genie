const db = require("../models");
const { validationResult } = require("express-validator");
const Amenity = db.amenity;

exports.addAmenity = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let amenity = [];
  try {
    req.files.forEach((file) => {
      if (file.mimetype.startsWith("image/")) {
        let obj = {
          path: file.path,
          iconname: file.filename,
          name: req.body.name,
        };
        amenity.push(obj);
      } else {
        return false;
      }
    });

    await Amenity.bulkCreate(amenity);
    if (amenity.length == 0) {
      return res.status(400).json({ msg: "please upload images only" });
    } else {
      return res.status(200).json({ MSG: "amenity uploaded sucessfully" });
    }
  } catch (e) {
    console.error(e);
    return res.status(400).json({ msg: "amenity not found" });
  }
};

exports.getAmenities = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }try {
    const amenities = await Amenity.findAll();

  return res.status(200).json({
    message: "Amenities found successfully",
    data: amenities,
  });
  } catch (error) {
    console.log(error);
    res.status(400).json({Message:"Something went wrong"});
  }
};

exports.deleteAmenities = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { amenity_id } = req.body;
  await Amenity.destroy({ where: { id: amenity_id } });
  return res.json({
    statusCode: 200,
    message: "Amenities deleted sucessfully",
  });
  } catch (error) {
   console.log(error);
   res.status(400).json({Message:"Something went wrong"}); 
  }
};
