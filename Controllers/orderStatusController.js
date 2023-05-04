const db = require('../models');
const OrderStatus = db.OrderStatus;
const User = db.User;
const Order = db.Order;
const User_fcmtoken = db.User_fcmtoken;
var admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json");
const moment = require('moment');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

//When the driver accept the order
// module.exports.DriverOrderAccept = async (req, res) => {
//     try {
//         const Order_Id = req.body.Order_Id;
//         const order = await Order.findOne({
//             where: { Order_Id: Order_Id }
//         })
//         const orderAssign = await Order.findOne({
//             where: { Order_Id: Order_Id, Driver_Id: null }
//         });

//         if (orderAssign == null) {
//             return res.json({ msg: "Order is Already Assigned" });
//         } else {
//             await orderAssign.update({
//                 Driver_Id: req.body.Driver_Id,
//                 Order_Assign: "1",
//                 Order_Status: "1"
//             });
//         }

//         //Find the fcmtoken and send the order confirmed message Successfully
//         const fcm_tokens = await User_fcmtoken.findAll({
//             where: { user_id: order.user_id },
//             attributes: ['fcmtoken']
//         });

//         fcm_tokens.forEach(user => {
//             let message = {
//                 notification: {
//                     title: "Order Confirmed", body: "You Order has Confirmed",
//                 }, token: user.dataValues.fcmtoken
//             };
//             admin.messaging().send(message);
//         });

//         res.json({ msg: "Order Confirmed Successfully" });
//     }
//     catch (error) {
//         return res.status(400).json({
//             message: error.message
//         })
//     }
// }

module.exports.DriverOrderAccept = async (req, res) => {
    try {
        const Order_Id = req.body.Order_Id;
        const order = await Order.findOne({
            where: { Order_Id: Order_Id }
        })
        const orderAssign = await Order.findOne({
            where: { Order_Id: Order_Id, Driver_Id: null, Order_Assign: "0" }
        });
        //Check the order is assigned to order person or not
        if (orderAssign == null) {
            return res.json({ msg: "Order is Already Assigned", value: "1" });
        } else {
            await orderAssign.update({
                Driver_Id: req.body.Driver_Id,
                Order_Assign: "1",
                Order_Status: "1"
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
                    android: { priority: high },
                    title: "Order Confirmed", body: "You Order has Confirmed",
                },
                token: user.dataValues.fcmtoken
            };
            console.log(message);
            admin.messaging().send(message);
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
            where: { Order_Id: Order_Id }
        });

        const complete_time = moment().format("DD MMMM YYYY, hh:mm A");;
        await OrderComplete.update({
            Order_Completed_time: complete_time,
            Order_Status: "2"
        })
        //Find the fcmtoken regarding the order 
        const order = await Order.findOne({
            where: { Order_Id: Order_Id }
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
            admin.messaging().send(message);
            console.log(user)


        })
        res.json({ msg: "Order Completed Successfully" });

    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

// //When the order has been not to assign anyone
module.exports.DriverOrderNoAssign = async (req, res) => {
    try {
        // 04/May/2023:07:15:25
        const Till = moment().format("DD MMMM, YYYY");
        const orderTill = ` ${Till}`;
        console.log(orderTill);
        const NoAssign = await Order.findAndCountAll({
            where: { Order_Assign: "0", Order_Status: "0" },
            attributes: ['Order_Id', 'Pickup_from', 'Deliver_To', 'Item_Type', 'Instruction', 'Order_Status', 'Order_Created_time', 'Order_Completed_time'],
            include: [{
                model: User,
                attributes: ['Name', 'photoUri'],
                required: true,
            }],
        })
        console.log(NoAssign);
        res.json({ Till: orderTill, msg: NoAssign, Till: orderTill, });
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}
module.exports.DriverStatusUpdate = async (req, res) => {
    try {
        // 04/May/2023:07:15:25
        const DriverComplete = await Order.findAndCountAll({
            where: { Order_Assign: "0", Order_Status: "0" },
            attributes: ['Order_Id', 'Pickup_from', 'Deliver_To', 'Item_Type', 'Instruction', 'Order_Status', 'Order_Created_time'],
            include: [{
                model: User,
                attributes: ['Name', 'photoUri'],
                required: true,
            }],
        })
        console.log(NoAssign);
        res.json({ msg: NoAssign });
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}



//
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