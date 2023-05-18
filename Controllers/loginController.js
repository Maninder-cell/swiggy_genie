const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

exports.signup = async (req, res) => {
    try {
        const { phoneNumber, name, email, address, CallingCode } = req.body;
        const hashPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = await user.create({
            calling_code: CallingCode,
            phone: phoneNumber,
            name: name,
            email: email,
            address: address,
            password: hashPassword,
            account_type: "0"
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
        const userdata = await user.findOne({ where: { email: email } });
        console.log(userdata);
        const matchPassword = await bcrypt.compare(password, userdata.password);

        if (!matchPassword) {
            res.status(400).json({ message: "Invalid Credentials" });
        }
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
        return res.status(200).json({ status: 'sucess', message: 'admin login...', data: userdata, token: token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ sucess: false, error });
    }
}

// exports.forgotpassword = async (req, res) => {
//     try {
//         const email = req.body.email;
//         const userdata = await user.findOne({ where: { email: email } });
//         console.log("userdata", userdata)
//         if (!userdata) {
//             res.status(500).json({ msg: "user does not exist" });
//             return;
//         }
//         const payload = {
//             id: userdata.id,
//             email: userdata.email
//         }

//         const token = jwt.sign(payload, "dbdad61f0eab1aded7bd4b43edd7", { expiresIn: '12h' });
//         const mailOptions = ({
//             from: 's12348946@gmail.com',
//             to: email,
//             subject: 'reset link',
//             html: '<p>Click <a href="http://localhost:3000/reset/' + token + '">here</a> to reset your password</p>'
//         })


//         const link = `http://localhost:3000/reset/${token}`;
//         console.log(link);

//         transpoter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.log(error);
//             }

//         })

//         res.status(201).json({ success: 'ok', msg: 'we have sent instructions to reset password over your registered email' });

//     } catch (error) {
//         console.log(error);
//     }
// }

// exports.resetpassword = async (req, res, next) => {
//     try {

//         const password = req.body.password;
//         const cpassword = req.body.cpassword;

//         const userid = req.userid;
//         const userdata = await user.findOne({ where: { id: userid } });

//         if (!userdata) {
//             res.send(500).json({ msg: "user does not exist" });
//             return;
//         }

//         if (password === cpassword) {
//             const hashpass = await bcrypt.hash(password, 12);
//             const updateuser = await user.update({ password: hashpass }, { where: { id: userid } });

//             console.log("updateuser", updateuser);

//             res.status(200).json({ sucess: "ok", message: "update sucessfully..." });
//         }

//         else {
//             res.status(400).send("Password doesnot match.....Enter the valid password");
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ message: error });
//     }
// }


