const db = require('../models');
const User = db.User;
const Order = db.Order;
const Notification = db.Notification;
const User_fcmtoken = db.User_fcmtoken;
const { Sequelize } = require('sequelize');
const moment = require('moment');
var admin = require("firebase-admin"); var serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

//Driver Accept the Order 
module.exports.DriverOrderAccept = async (req, res) => {
    try {
        const Order_Id = req.body.order_id;
        const order = await Order.findOne({
            where: { order_id: Order_Id }
        })
        const orderAssign = await Order.findOne({
            where: { order_id: Order_Id, driver_id: null, order_assign: "0" }
        });
        //Check the order is assigned to order person or not
        if (orderAssign == null) {
            return res.json({ msg: "Order is Already Assigned", value: "1" });
        } else {
            await orderAssign.update({
                driver_id: req.body.Driver_Id,
                order_assign: "1",
                order_status: "1"
            });
        }

        //Find the fcmtoken and send the order confirmed message Successfully
        const fcm_tokens = await User_fcmtoken.findAll({
            where: { user_id: order.user_id },
            attributes: ['fcmtoken']
        });

        fcm_tokens.forEach(user => {
            let message = {
                notification: {
                    title: "Order Confirmed", body: "You Order has Confirmed",
                },
                token: user.dataValues.fcmtoken
            };
            admin.messaging().send(message).then(async (msg) => {
                await Notification.create({ user_id: order.user_id, text: message.notification.body });
            });
        });

        res.json({ msg: "Order Confirmed Successfully" });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

//When the driver complete the orders
module.exports.DriverOrderComplete = async (req, res) => {
    try {
        const Order_Id = req.body.Order_Id;

        const OrderComplete = await Order.findOne({
            where: { order_id: Order_Id }
        });

        const complete_time = moment().format("DD MMMM YYYY, hh:mm A");;
        await OrderComplete.update({
            order_completed_time: complete_time,
            order_status: "2"
        })
        //Find the fcmtoken regarding the order 
        const order = await Order.findOne({
            where: { order_id: Order_Id }
        })
        const fcm_tokens = await User_fcmtoken.findAll({
            where: { user_id: order.user_id },
            attributes: ['fcmtoken']
        });
        fcm_tokens.forEach(user => {
            let message = {
                notification: {
                    title: "Order Complete", body: "You Ordered Completed Successfully",
                }, token: user.dataValues.fcmtoken
            };
            admin.messaging().send(message).then(async (msg) => {
                await Notification.create({ user_id: order.user_id, text: message.notification.body });
            });;
        })
        res.json({ msg: "Order Completed Successfully" });

    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

// //When the order has been not to assign anyone and driver pick in the five kilometer
module.exports.DriverOrderNoAssign = async (req, res) => {
    try {

        const delivery_latitude = req.body.delivery_latitude; // User's latitude
        const delivery_longitude = req.body.delivery_longitude; // User's longitude
        const maxDistance = 5; // Maximum distance in km

        const haversine = `(
                6371 * acos(
                    cos(radians(${delivery_latitude}))
                    * cos(radians(pickup_latitude))
                    * cos(radians(pickup_longitude) - radians(${delivery_longitude}))
                    + sin(radians(${delivery_latitude})) * sin(radians(pickup_latitude))
                )
            )`;

        const order = await Order.findAll({
            where: { order_assign: "0", order_status: "0" },
            attributes: [
                'order_id', 'pickup_from', 'deliver_to', 'item_type', 'instruction', 'order_status', 'order_created_time', 'order_completed_time',
                [Sequelize.literal(`round(${haversine}, 3)`), 'distance'],
            ],
            order: Sequelize.col('distance'),
            having: Sequelize.literal(`distance <= ${maxDistance}`),
            include: [{
                model: User,
                attributes: ['name', 'photo_uri'],
                required: true,
            }],
        });

        console.log(haversine);
        console.log(order);
        const Till = moment().format("DD MMMM, YYYY");
        const orderTill = ` ${Till}`;
        console.log(order);
        res.json({ Till: orderTill, count: order.length, order: order })
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

module.exports.Userfcmtoken = async (req, res) => {
    try {
        const { user_id, fcmtoken } = req.body;
        const Usertoken = await User_fcmtoken.create({
            user_id: user_id,
            fcmtoken: fcmtoken,
        })
        res.json({ msg: "Your fcmtoken saved Successfully", data: Usertoken });
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}