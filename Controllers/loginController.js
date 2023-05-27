const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');

const user = models.User;

exports.signup = async (req, res) => {
    try {
        const { phoneNumber, name, email, address, CallingCode, photo } = req.body;
        const hashPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = await user.create({
            calling_code: CallingCode,
            phone: phoneNumber,
            name: name,
            email: email,
            address: address,
            password: hashPassword,
            account_type: "0",
            photo_uri: photo
        });
        res.json({ msg: newUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ sucess: false, error });
    }
}

exports.login = async (req, res) => {
    try {
        console.log('dshajfkjd');
        const { email, password } = req.body;
        const userdata = await user.findOne({ where: { email: email }, attributes: ['id', 'name', 'email', 'account_type', 'password', 'tokens'] });
        // const userdata = await user.findOne({ where: { email: email }, attributes: ['id', 'email', 'account_type', 'tokens'] });
        console.log(userdata);
        const matchPassword = await bcrypt.compare(password, userdata.password);

        if (!matchPassword) {
            res.status(400).json({ message: "Invalid Credentials" });
        }
        if (matchPassword) {
            const token = jwt.sign(
                { id: userdata.id, email: userdata.email, account_type: userdata.account_type },
                "dbdad61f0eab1aded7bd4b43edd7",
                {
                    expiresIn: "15d",
                }
            );
            await userdata.update({
                tokens: token
            })
            return res.status(200).json({ success: true, message: 'Admin Login Successfully', data: userdata });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ sucess: false, error });
    }
}


