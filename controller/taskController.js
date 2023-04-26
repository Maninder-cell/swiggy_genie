const db = require("../models");
const { validationResult } = require("express-validator");
const mbxClient = require("@mapbox/mapbox-sdk");
const mbxDirections = require("@mapbox/mapbox-sdk/services/directions");
const moment = require("moment");
const baseClient = mbxClient({
  accessToken:
    "pk.eyJ1IjoibmF1c2hhZGlhIiwiYSI6ImNsZ296eXA3NDBiOWkzaG1ybWoxM3dmNWcifQ.bB-kCl0347BPsc_q-7GIOg",
});
const directionsClient = mbxDirections(baseClient);
const Amenity = db.amenity;
const Task = db.task;
const Order = db.order_details;
const User = db.user;

const taskAmenity = db.taskAmenity;

// exports.distance = async (req, res) => {
//   directionsClient
//     .getDirections({
//       profile: "driving-traffic",
//       waypoints: [
//         { coordinates: req.body.origin },
//         { coordinates: req.body.destination },
//       ],
//       geometries: "geojson",
//       steps: true,
//     })
//     .send()
//     .then((response) => {
//       const distance = Math.floor(response.body.routes[0].distance / 1000);
//       res.status(200).json({ distance });
//     });
// };

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
    const { amenity_id } = req.params;
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
    console.log(req.body);
    const attr = {...req.body};

    const taskName = await Amenity.findByPk(attr.Task_details);

    const task = await Task.create({
      Pickup_from: attr.originAddress,
      Deliver_To: attr.destinationAddress,
      Instruction: attr.Instruction,
      Add_Task_details: taskName.name,
    });

    await taskAmenity.create({
      AmenityId: attr.Task_details,
      taskId: task.id,
    });
    let distance;
    await directionsClient
      .getDirections({
        profile: "driving-traffic",
        waypoints: [{ coordinates: attr.origin }, { coordinates: attr.destination }],
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
      Pickup_from: attr.originAddress,
      Deliver_To: attr.destinationAddress,
      Instruction: attr.Instruction,
      Item_Type: taskName.name,
      Billing_Details: distance,
      status: '0',
      OrderId,
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

exports.feedback = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const order = { ...req.body };
    const update = await Order.findOne({ where: { orderId: req.params.orderId } });
    console.log(update);
    await update.update(order);
    if (req.role == 1) {
      update.update({
        DriverId: req.id,
      });
    }
    return res.status(200).json({ Message: "Order Updated Sucessfully" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ Message: "Something Went Wrong" });
  }
};

exports.getOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // const {count : orderCount, rows: orders} = await Order.findAndCountAll({where:{DriverId:req.id,status:'1'},attributes:['Pickup_from','Deliver_To','Item_Type','OrderId','createdAt']});
    const {count : totalOrders, rows: orders} = await Order.findAndCountAll({where:{status:'0'},attributes:['Pickup_from','Deliver_To','Item_Type','OrderId','createdAt']});
    var today = new Date();
    var Till =
      today.getDate() +
      " " +
      today.toLocaleString("default", { month: "long" }) +
      " " +
      today.getFullYear();
    // const totalOrders = await Order.count({
    //   // where: { DriverId: req.id, status: "1" },
    //   where: { DriverId: "1", status: "2" },
    // });
    // const PendingOrder = await Order.findAll({
    //   where: { status: "0" },
    //   attributes: [
    //     "Pickup_from",
    //     "Deliver_To",
    //     "Item_Type",
    //     "OrderId",
    //     "createdAt",
    //   ],
    // });
    const PendingOrders = orders.map((order) => {
      return {
        ...order.toJSON(),
        createdAt: moment(order.createdAt).format("DD MMMM YYYY, hh:mm A"),
      };
    });
    // const user = await User.findByPk((req.id));
    const user = await User.findByPk((1));
    if (user.status == '1') {
      return res.status(200).json({ totalOrders, PendingOrders, Till });
    } else {
      return res.status(200).json({  Till });
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json({ Message: "Something Went Wrong" });
  }
};
