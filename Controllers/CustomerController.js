const models = require('../models');
const user = models.User;
const payment = models.Payment;
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const order = models.Order;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'zwigato09@gmail.com',
        pass: 'mpjmgvwgklryvnze'
    }
});
//Get all the User details 
exports.getuser = async (req, res) => {
    try {
        const page = req.body.page;
        const limit = parseInt(req.body.limit);
        const offset = (page - 1) * limit;
        const account_type = req.body.account_type;
        const keyword = req.body.searchText;

        if (keyword && account_type == '2') {
            const { rows, count } = await user.findAndCountAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${keyword}%` } },
                        { address: { [Op.like]: `%${keyword}%` } },
                        { phone: { [Op.like]: `%${keyword}%` } }
                    ],
                    account_type: '2',
                },
                attributes: ["id", 'name', 'phone', 'address', 'photo_uri'],
                offset: offset,
                limit: limit,
                order: [["createdAt", "DESC"]]
            });
            return res.status(200).json({ success: true, msg: "Customer Data Successfully", data: rows, count: count });
        } else {
            if (account_type == '2') {
                const customer = await user.findAll({
                    where: { account_type: '2' },
                    attributes: ['id', 'name', 'phone', 'address', 'photo_uri'],
                    offset: offset,
                    limit: limit,
                    order: [["createdAt", "DESC"]]
                });
                return res.status(200).json({ sucess: true, msg: "Customer Data Successfully", data: customer });
            }
            else {
                return res.status(400).json({ success: false, msg: "Invalid argument" })
            }
        }
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Get  the one User detail
module.exports.getoneuser = async (req, res) => {
    try {
        const data = req.body.id
        const Userdata = await user.findOne({
            where: { id: data, account_type: '2' },
        })
        if (Userdata != null) {
            return res.status(200).json({
                success: true, msg: "User Detail Get Successfully",
                data: Userdata
            })
        } else {
            return res.status(400).json({
                success: false, msg: "Invalid argument"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    }
}

//Changed the block or unblock status for user and driver
module.exports.block = async (req, res) => {
    try {
        const UserId = req.body.id;
        const Usermatch = await user.findByPk(UserId);
        const block = req.body.block;
        console.log(block);
        if (block == 1) {
            await Usermatch.update({
                block: '1'
            })
            return res.status(200).json({ success: true, msg: "User block Successfully" });
        } else {
            await Usermatch.update({
                block: '0'
            })
            return res.status(200).json({ success: true, msg: "User Unblock Successfully" });
        }
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

module.exports.createdriver = async (req, res) => {
    try {
        const driverfind = await user.findOne({
            where: { phone: req.body.contact }
        })
        if (driverfind) {
            return res.status(401).json({ success: false, msg: "Number is Already Registered" });
        } else {
            const drive = await user.create({
                name: req.body.name,
                address: req.body.address,
                phone: req.body.contact,
                photo_uri: req.file.filename,
                calling_code: 91 || req.body.calling_code,
                email: req.body.email,
                account_type: '1'
            });
            if (drive) {
                await transporter.sendMail({
                    to: req.body.email,
                    from: 'zwigato09@gmail.com',
                    subject: 'Welcome to Zwigato',
                    html: `
     <html>
      <body>
        <p>
          Hi ${req.body.name},
          <br><br>
          You have successfully registered with Zwigato App. You can now log in using the provided number.
          <br><br>
          We hope you have a great journey with us.
          <br><br>
          Good luck!
        </p>
      </body>
    </html>
  `
                })
            }
            return res.status(201).json({ success: true, msg: "Driver Created Successfully", data: drive });
        }
    }
    catch (error) {
        return res.status(400).json({ msg: error });
    }
}

//Get all driver details 
exports.getdriver = async (req, res) => {
    try {
        const page = req.body.page;
        const limit = parseInt(req.body.limit);
        const offset = (page - 1) * limit;
        const account_type = req.body.account_type;
        const keyword = req.body.searchText;

        if (keyword && account_type == '1') {
            const { rows, count } = await user.findAndCountAll({
                where: {
                    [Op.or]: [
                        { id: { [Op.like]: `%${keyword}%` } },
                        { name: { [Op.like]: `%${keyword}%` } },
                        { address: { [Op.like]: `%${keyword}%` } },
                        { phone: { [Op.like]: `%${keyword}%` } }
                    ],
                    account_type: '1',
                },
                attributes: ["id", 'name', 'phone', 'address', 'account_type', 'photo_uri'],
                offset: offset,
                limit: limit,
                order: [["createdAt", "DESC"]]
            });
            return res.status(200).json({ success: true, msg: "Driver Data Successfully", data: rows, count: count });
        } else {
            if (account_type == '1') {
                const customer = await user.findAll({
                    where: { account_type: '1' },
                    attributes: ['id', 'name', 'phone', 'address', 'account_type', 'photo_uri'],
                    offset: offset,
                    limit: limit,
                    order: [["createdAt", "DESC"]]
                });
                return res.status(200).json({ sucess: true, msg: "Driver Data Successfully", data: customer });
            }
            else {
                return res.status(400).json({ success: false, msg: "Invalid argument" })
            }
        }
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Get one driver detail
module.exports.getonedriver = async (req, res) => {
    try {
        const data = req.body.id
        const Driverdata = await user.findOne({
            where: { id: data, account_type: '1' },
            attributes: ['id', 'calling_code', 'phone', 'name', 'email', 'address', 'block', 'account_type', 'latitude', 'longitude', 'photo_uri', 'last_logged_in']
        })
        if (Driverdata != null) {
            return res.status(200).json({
                success: true, msg: "Driver Detail Get Successfully",
                data: Driverdata
            })
        } else {
            return res.status(400).json({
                success: false, msg: "Invalid argument"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    }
}

//Get all the order details
exports.getorders = async (req, res) => {
    try {
        const page = req.body.page;
        const limit = parseInt(req.body.limit);
        const offset = (page - 1) * limit;
        const searchText = req.body.searchText;

        if (searchText) {
            console.log(searchText)
            const { rows, count } = await order.findAndCountAll({
                where: {
                    [Op.or]: [
                        { order_id: { [Op.like]: `%${searchText}%` } },
                        { pickup_from: { [Op.like]: `%${searchText}%` } },
                        { deliver_to: { [Op.like]: `%${searchText}%` } },
                        { category_item_type: { [Op.like]: `%${searchText}%` } },
                    ]
                },
                include: [
                    {
                        // where: {
                        //     [Op.or]: [
                        //         { name: { [Op.like]: `%${searchText}%` } },
                        //         { phone: { [Op.like]: `%${searchText}%` } },
                        //     ]
                        // },
                        model: user,
                        attributes: ['name', 'phone', 'address', 'photo_uri'],
                        required: true
                    }],
                offset,
                limit,
                order: [["createdAt", "DESC"]]
            });
            return res.status(200).json({ sucess: true, msg: "Order Data Successfully", data: rows, count: count });
        } else {
            const data = await order.findAll(
                {
                    include: [
                        {
                            model: user,
                            attributes: ['name', 'phone', 'address', 'photo_uri'],
                            required: true
                        }],
                    offset,
                    limit,
                    order: [["createdAt", "DESC"]]
                },
            );
            return res.status(200).json({ sucess: true, msg: "Orders Data Successfully", data: data });
        }
    } catch (error) {
        res.status(500).json({ sucess: false, msg: error });
    }
};

//Get one order detail
module.exports.getoneorder = async (req, res) => {
    try {
        const data = req.body.order_id
        console.log('ddddddddddddddddddddddddddd', data);
        const Orderdata = await order.findOne({
            where: { order_id: data },
            include: [{
                model: payment,
            }],
            include: [{
                model: user,
                attributes: ['name', 'photo_uri'],
                required: true,
            }],
        })
        if (Orderdata != null) {
            return res.status(200).json({
                success: true, msg: "Order Detail Get Successfully",
                data: Orderdata
            })
        } else {
            return res.status(400).json({
                success: false, msg: "Invalid argument"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    }
}

//Get all the payment  details
exports.getpayment = async (req, res) => {
    try {
        const page = req.body.page;
        const limit = parseInt(req.body.limit);
        const offset = (page - 1) * limit;
        const searchText = req.body.searchText;
        if (searchText) {
            const { rows, count } = await payment.findAndCountAll({
                where: {
                    [Op.or]: [
                        { order_id: { [Op.like]: `%${searchText}%` } },
                        { billing_details: { [Op.like]: `%${searchText}%` } },
                        { pickup_from: { [Op.like]: `%${searchText}%` } },
                        { deliver_to: { [Op.like]: `%${searchText}%` } },
                        { order_created_time: { [Op.like]: `%${searchText}%` } },
                        { category_item_type: { [Op.like]: `%${searchText}%` } },
                    ],
                },
                include: [{
                    model: order,
                    include: [{
                        model: user,
                        attributes: ['name', 'photo_uri'],
                        required: true,
                    }],
                    required: true,
                }],
                offset,
                limit,
                order: [["createdAt", "DESC"]]
            });
            return res.status(200).json({ sucess: true, msg: "Payment Data Successfully", data: rows, count: count });
        }
        else {
            const getpayment = await payment.findAll({
                include: [{
                    model: order,
                    include: [{
                        model: user,
                        attributes: ['name', 'photo_uri'],
                        required: true,
                    }],
                    required: true,
                }],
                offset,
                limit,
                order: [["createdAt", "DESC"]]
            });
            return res.status(200).json({ sucess: true, msg: "Payment Data Successfully", data: getpayment });
        };
    } catch (error) {
        return res.status(500).json({ success: false, err: error })
    }
}

//Get one payment detail
module.exports.paymentstatus = async (req, res) => {
    try {
        const orderdata = req.body.order_id;
        const status = req.body.status;
        const paymentdata = await payment.findOne({
            where: { order_id: orderdata }
        })
        if (paymentdata.paid == 1 && status == 0) {
            const pending = await paymentdata.update({
                paid: status
            });
            return res.status(200).json({ success: true, msg: "Payment status changed to Unpaid Successfully", data: pending });
        }
        else if (paymentdata.paid == 0 && status == 1) {
            const paid = await paymentdata.update({
                paid: status
            });
            return res.status(200).json({ success: true, msg: "Payment status changed to Paid Successfully", data: paid });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, err: error })
    }
}







