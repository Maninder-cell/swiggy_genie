const StripeMain = require("../services/stripe");
const { validationResult } = require("express-validator");
const db = require('../models');
const User = db.User;
const Card = db.Card;
const Payment = db.Payment;

// exports.createCustomer = async (req, res, next) => {
//   const number = req.body.number.replace(/\s/g, '');
//   const {customer,error} = await StripeMain.createCustomer({
//     name: req.body.name,
//     email: req.body.email,
//     payment_method: {
//       type: "card",
//       card: {
//         number: number,
//         exp_month: req.body.expiry.split("/")[0],
//         exp_year: req.body.expiry.split("/")[1],
//         cvc: req.body.cvv,
//       },
//     },
//   });

//   if (error){
//     return res.status(402).json({
//       error: error,
//     });
//   }
//   else{
//     return res.status(200).json({
//       customer: customer,
//     });
//   }
// };

exports.pay = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findOne({where: {id: req.user.id}});

  const payment = await StripeMain.Pay(
    req.body.amount,
    user.stripe_id,
    req.body.pay_id
  );

  await Payment.create({user_id: req.user.id,order_id:2,stripe_payment_id: payment.id});

  return res.status(200).json({
    payment: payment,
  });
};

exports.newPaymentMethod = async (req, res, next) => {
  const user = await User.findOne({where: {id: req.user.id}});

  if(user.stripe_id){
    const number = req.body.number.replace(/\s/g, '');
    const result = await StripeMain.NewPaymentMethod(user.stripe_id, {
      type: "card",
      card: {
        number: number,
        exp_month: req.body.expiry.split("/")[0],
        exp_year: req.body.expiry.split("/")[1],
        cvc: req.body.cvv,
      },
    });

    if(result){
      const payment_method = await StripeMain.getPaymentMethod(result.id)
      await Card.create({
        user_id:req.user.id,
        stripe_card_id: payment_method.id,
        card_no:payment_method.card.last4,
        name:payment_method.card.networks.available[0],
        month:payment_method.card.exp_month,
        year:payment_method.card.exp_year,
      });
    }

    return res.status(200).json({
      result: result,
    });
  }
  else{
    const number = req.body.number.replace(/\s/g, '');
    const {customer,error} = await StripeMain.createCustomer({
      name: user.name,
      email: user.email,
      payment_method: {
        type: "card",
        card: {
          number: number,
          exp_month: req.body.expiry.split("/")[0],
          exp_year: req.body.expiry.split("/")[1],
          cvc: req.body.cvv,
        },
      },
    });

    if (error){
      return res.status(402).json({
        error: error,
      });
    }
    else{
      const payment_method = await StripeMain.getPaymentMethod(customer.invoice_settings.default_payment_method)
      await Card.create({
        user_id:req.user.id,
        stripe_card_id: payment_method.id,
        card_no:payment_method.card.last4,
        name:payment_method.card.networks.available[0],
        month:payment_method.card.exp_month,
        year:payment_method.card.exp_year,
        is_default:true
      });

      user.stripe_id = customer.id;
      user.save();

      return res.status(200).json({
        customer: customer,
      });
    }
  }
};

exports.listPaymentMethods = async (req, res, next) => {
  const user = await User.findOne({where: {id: req.user.id}});

  if(user.stripe_id){
    const list = await StripeMain.ListAllPaymentMethods(user.stripe_id);
    console.log(list);
    return res.status(200).json({
      list: list,
    });
  }

  return res.status(200).json({data:[]});
};

exports.listCards = async(req,res,next) => {
  const cards = await Card.findAll({where: {user_id: req.user.id}})

  return res.status(200).json({cards: cards});
}