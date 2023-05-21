const models = require('../models');
const user = models.User;
const payment = models.Payment;

const { Op } = require('sequelize');
const order = models.Order;

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

module.exports.block = async (req, res) => {
    try {
        const UserId = req.body.id;
        const Usermatch = await user.findByPk(UserId);
        console.log(Usermatch.block);
        if (Usermatch.block == 0) {
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
        const drive = await user.create({
            name: req.body.name,
            address: req.body.address,
            phone: req.body.contact,
            photo_uri: req.file.filename,
            calling_code: 91,
            account_type: '1'
        });
        res.status(200).json({ success: true, msg: "Driver Created Successfully", data: drive });
    }
    catch (error) {
        res.status(400).json({ msg: error });
    }
}

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
                        { pickup_from: { [Op.like]: `%${searchText}%` } },
                        { deliver_to: { [Op.like]: `%${searchText}%` } },
                        { category_item_type: { [Op.like]: `%${searchText}%` } },
                        { order_status: { [Op.like]: `%${searchText}%` } }
                    ]
                },
                include: [
                    {
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

module.exports.getoneorder = async (req, res) => {
    try {
        const data = req.body.order_id
        const Orderdata = await order.findOne({
            where: { order_id: data },
            include: [{
                model: payment,
            }]
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
                        { user_id: { [Op.like]: `%${searchText}%` } },
                        { order_id: { [Op.like]: `%${searchText}%` } },
                        { stripe_payment_id: { [Op.like]: `%${searchText}%` } },
                        { paid: { [Op.like]: `%${searchText}%` } },
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







