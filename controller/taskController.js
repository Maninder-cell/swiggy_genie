const db = require("../models");
const { validationResult } = require("express-validator");
const mbxClient = require("@mapbox/mapbox-sdk");
const mbxDirections = require("@mapbox/mapbox-sdk/services/directions");
const baseClient = mbxClient({
  accessToken:
    "pk.eyJ1IjoibmF1c2hhZGlhIiwiYSI6ImNsZ296eXA3NDBiOWkzaG1ybWoxM3dmNWcifQ.bB-kCl0347BPsc_q-7GIOg",
});
const directionsClient = mbxDirections(baseClient);
const Amenity = db.amenity;
const Task = db.task;
const Order = db.order_details;

const taskAmenity = db.taskAmenity;

exports.distance = async (req, res) => {
  directionsClient
    .getDirections({
      profile: "driving-traffic",
      waypoints: [
        { coordinates: req.body.origin },
        { coordinates: req.body.destination },
      ],
      geometries: "geojson",
      steps: true,
    })
    .send()
    .then((response) => {
      const distance = Math.floor(response.body.routes[0].distance / 1000);
      res.status(200).json({ distance });
    });
};

exports.addAmenity = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let amenity = [];
  try {
    let asize = 0;
    req.files.forEach((file) => {
      asize += 1;
      if (file.mimetype.startsWith("image/") === true) {
        let obj = {
          path: file.path,
          iconname: file.filename,
          name: req.body.name,
        };
        amenity.push(obj);
      } else {
        return res.status(400).json({ message: "Please Upload image only" });
      }
    });
    if (amenity.length === asize) {
      await Amenity.bulkCreate(amenity);
      return res
        .status(200)
        .json({ MSG: "amenity uploaded sucessfully", amenity });
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
  }
  try {
    const amenities = await Amenity.findAll();

    return res.status(200).json({
      message: "Amenities found successfully",
      data: amenities,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ Message: "Something went wrong" });
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
    res.status(400).json({ Message: "Something went wrong" });
  }
};

exports.addOrder = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      originAddress,
      destinationAddress,
      Instruction,
      Task_details,
      origin,
      destination,
    } = await req.body;

    const taskName = await Amenity.findByPk(Task_details);

    const task = await Task.create({
      Pickup_from: originAddress,
      Deliver_To: destinationAddress,
      Instruction,
      Add_Task_details: taskName.name,
    });

    await taskAmenity.create({
      AmenityId: Task_details,
      taskId: task.id,
    });
    let distance;
    await directionsClient
      .getDirections({
        profile: "driving-traffic",
        waypoints: [{ coordinates: origin }, { coordinates: destination }],
        geometries: "geojson",
        steps: true,
      })
      .send()
      .then((response) => {
        distance = Math.floor(response.body.routes[0].distance / 1000) * 10;
      });
      var OrderId = Math.random();
      OrderId = OrderId * 100000000;
      OrderId = parseInt(OrderId);

    const order = await Order.create({
      Pickup_from: originAddress,
      Deliver_To: destinationAddress,
      Instruction,
      Item_Type: taskName.name,
      Billing_Details: distance,
      Status: "Pending",
      OrderId
    });

    const data = await Task.findOne({
      where: { id: task.id },
      include: [
        {
          model: Amenity,
        },
      ],
    });
    return res.status(200).json({
      msg: "task created sucessfully",
      task: data,
      order: order,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ Message: "Something Went Wrong" });
  }
};

exports.feedback = async(req,res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const order = {...req.body};
   const  update = await Order.findOne({where:{orderId:order.orderId}});
   update.update(order);
    return res.status(200).json({Message:"Order Updated Sucessfully"});
  } catch (error) {
    console.log(error);
    return res.status(200).json({ Message: "Something Went Wrong" });
  }
}
