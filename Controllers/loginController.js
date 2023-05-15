const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const user = models.User;

require('dotenv').config();

const transpoter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
        user: process.env.User_email,
        pass: process.env.User_password
    },
    tls: {
        rejectUnauthorized: false
    }

});






exports.login = async (req, res) => {
    try {
        const { email } = req.body;
        const { password } = req.body;
        // const hashpass=bcrypt.hash(password,12)
        const userdat = await user.findOne({ where: { email: email } });
        if (userdat) {
            if (password === "Admin@123") {
                const payload = {
                    id: userdat.id,
                    email: userdat.email
                }
                const email = userdat.email;
                const token = jwt.sign(payload, "dbdad61f0eab1aded7bd4b43edd7", { expiresIn: '12h' });
                res.status(200).json({ status: 'sucess', message: 'admin login...', email: email, token: token });
                return;
            }
        }
        else {
            res.status(500).json({ success: false, msg: "Email Or Password Does Not Match" });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ sucess: false, error });
    }
}


exports.forgotpassword = async (req, res) => {
    try {
        const email = req.body.email;
        const userdata = await user.findOne({ where: { email: email } });
        console.log("userdata", userdata)
        if (!userdata) {
            res.status(500).json({ msg: "user does not exist" });
            return;
        }
        const payload = {
            id: userdata.id,
            email: userdata.email
        }

        const token = jwt.sign(payload, "dbdad61f0eab1aded7bd4b43edd7", { expiresIn: '12h' });
        const mailOptions = ({
            from: 's12348946@gmail.com',
            to: email,
            subject: 'reset link',
            html: '<p>Click <a href="http://localhost:3000/reset/' + token + '">here</a> to reset your password</p>'
        })


        const link = `http://localhost:3000/reset/${token}`;
        console.log(link);

        transpoter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }

        })

        res.status(201).json({ success: 'ok', msg: 'we have sent instructions to reset password over your registered email' });

    } catch (error) {
        console.log(error);
    }
}






exports.resetpassword = async (req, res, next) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.cpassword;

        const userid = req.userid;
        const userdata = await user.findOne({ where: { id: userid } });

        if (!userdata) {
            res.send(500).json({ msg: "user does not exist" });
            return;
        }

        if (password === cpassword) {
            const hashpass = await bcrypt.hash(password, 12);
            const updateuser = await user.update({ password: hashpass }, { where: { id: userid } });

            console.log("updateuser", updateuser);

            res.status(200).json({ sucess: "ok", message: "update sucessfully..." });
        }

        else {
            res.status(400).send("Password doesnot match.....Enter the valid password");
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }
}


