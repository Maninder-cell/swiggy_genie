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
        console.log('dfadsfsadfadf', account_type);
        const keyword = req.body.searchText;

        if (keyword && account_type) {
            const { rows, count } = await user.findAndCountAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${keyword}%` } },
                        { address: { [Op.like]: `%${keyword}%` } },
                        { phone: { [Op.like]: `%${keyword}%` } }
                    ],
                    account_type: account_type,
                },
                attributes: ["id", 'name', 'phone', 'address', 'account_type'],
                offset: offset,
                limit: limit,
            });
            return res.status(200).json({ success: true, data: rows, count: count });
        }
        else {
            if (account_type == 2) {
                const customer = await user.findAll({
                    where: { account_type: account_type },
                    attributes: ['id', 'name', 'phone', 'address', 'account_type'],
                    offset: offset,
                    limit: limit,
                });
                console.log(customer);
                res.status(200).json({ sucess: true, data: customer });

                // console.log()
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    }
}



exports.createdriver = async (req, res, next) => {
    try {


        //  const filename=req.file.filename
        //  console.log(filename);
        const userid = req.userid;
        const accountt = await user.findOne({ where: { id: userid } });
        const account = accountt.account_type;
        if (account === 0) {
            console.log("ddriverdata", req.body.driverdata);
            const drive = await user.create({
                name: req.body.driverdata.name,
                address: req.body.driverdata.address,
                contact: req.body.driverdata.contact,
                // image:filename,
                email: req.body.driverdata.email,
                account_type: req.body.account_type



            });
            console.log(drive);
            res.status(200).json({ data: drive });
        } else {
            res.status(500).json("You Don't Have Access To Create The Driver");
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error });
    }
}

exports.getdriver = async (req, res) => {
    try {
        const page = req.body.page;
        console.log(page);
        const limit = parseInt(req.body.limit);
        console.log(limit);

        const offset = (page - 1) * limit;
        console.log(offset);
        const id = req.body.id;

        const keyword = req.body.searchText;
        const account_type = req.body.account_type;
        console.log(account_type);
        if (id) {
            const dri = await user.findByPk(id);
            if (dri) {
                return res.status(200).json({ data: dri });
            } else {
                return res.status(404).json({ message: "driver not found" });
            }
        }
        if (keyword && account_type) {
            const { rows, count } = await user.findAndCountAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${keyword}%` } },
                        { address: { [Op.like]: `%${keyword}%` } },
                        { contact: { [Op.like]: `%${keyword}%` } }
                    ],
                    account_type: account_type,
                },
                offset: offset,
                limit: limit,
            });
            console.log("driver data", rows);
            res.status(200).json({ data: rows, count: count });
            return;
        }
        else {
            if (account_type == 1) {
                const data = await user.findAll({
                    where: {
                        account_type: account_type
                    },
                    offset: offset,
                    limit: limit,
                });
                return res.status(200).json({ data });
            }

        }


    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error });
    }
}


exports.getorders = async (req, res) => {
    try {


        const page = req.body.page;
        console.log(page);
        const limit = parseInt(req.body.limit);
        console.log(limit);

        const offset = (page - 1) * limit;
        console.log(offset);
        const id = req.body.id;

        const searchText = req.body.searchText;

        if (id) {
            const ord = await order.findByPk(id);
            if (ord) {
                return res.status(200).json({ data: ord });
            } else {
                return res.status(404).json({ message: "order not found" });
            }
        }
        if (searchText) {
            const { rows, count } = await order.findAndCountAll({
                where: {
                    [Op.or]: [
                        { pickup_from: { [Op.like]: `%${searchText}%` } },
                        { deliver_to: { [Op.like]: `%${searchText}%` } },
                        { category_item_type: { [Op.like]: `%${searchText}%` } },
                        { order_status: { [Op.like]: `%${searchText}%` } },
                    ],
                    include: [
                        {
                            model: user,
                        },
                    ],
                },
                offset,
                limit
            });

            console.log("order data", rows);
            return res.status(200).json({ data: rows, count: count });
        } else {
            const data = await order.findAll(
                {
                    include: [
                        {
                            model: user
                        },
                    ],
                    offset,
                    limit
                },
            );
            res.status(200).json({ data: data });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    }
};

exports.isblocked = async (req, res) => {
    try {

        const block = parseInt(req.body.block);
        console.log(block);

        const userid = req.body.id;
        console.log("bcnfdhnvf", userid);

        const user_id = req.user.id;
        console.log("ngvfbgk", user_id)

        const user = await user.findOne({ where: { id: user_id } });

        const account_type = user.account_type;
        console.log('account_type', account_type);

        if (account_type === '2') {


            if (block === 0) {

                await user.update({ block: '0' }, { where: { id: userid }, returning: true });


                res.status(200).json({ msg: 'User active' });
                return;

            } else if (block === 1) {

                await user.update({ block: '1' }, { where: { id: userid }, returning: true });

                res.status(200).json({ msg: 'User blocked' });
                return;
            }



        } else {

            res.status(500).json({ msg: 'Unauthorized ' });
        }




    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getpayment = async (req, res) => {
    try {
        const page = req.body.page;
        const limit = req.body.limit;
        const offset = (page - 1) * limit;

        const searchText = req.body.searchText;

        if (searchText) {
            const { rows, count } = await payment.findAndCountAll({
                where: {
                    [Op.or]: [
                        { order_id: { [Op.like]: `%${searchText}%` } },
                        { stripe_payment_id: { [Op.like]: `%${searchText}%` } },
                        { paid: { [Op.like]: `%${searchText}%` } },
                    ],
                },
                include: [{
                    model: user,
                    as: 'customer',
                },
                {
                    model: order,
                    attributes: ["order_id", "category_item_type", "pickup_from", "deliver_to"]
                }

                ],

                offset,
                limit
            });

            console.log("order data", rows);
            return res.status(200).json({ data: rows, count: count });
        }
        else {
            const getpayment = await payment.findAll({
                attributes: ['id', 'paid'],
                include: [{
                    model: user,
                    as: 'customer',
                    attributes: ['name']
                },
                {
                    model: order,
                    attributes: ["order_id", "category_item_type", "pickup_from", "deliver_to"]
                }
                ],
                offset,
                limit
            });
            res.status(200).json({ data: getpayment });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: error })
    }
}







