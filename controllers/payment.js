const StripeMain = require("../services/stripe");
const { validationResult } = require("express-validator");

exports.createCustomer = async (req, res, next) => {
  const number = req.body.number.replace(/\s/g, '');
  const {customer,error} = await StripeMain.createCustomer({
    name: req.body.name,
    email: req.body.email,
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
    return res.status(200).json({
      customer: customer,
    });
  }
};

exports.pay = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const payment = await StripeMain.Pay(
    req.body.amount,
    "cus_NoVup9TQKR9ZJn",
    req.body.pay_id
  );

  return res.status(200).json({
    payment: payment,
  });
};

exports.newPaymentMethod = async (req, res, next) => {
  const number = req.body.number.replace(/\s/g, '');
  const result = await StripeMain.NewPaymentMethod("cus_NmD7JOk3zTJANY", {
    type: "card",
    card: {
      number: number,
      exp_month: req.body.expiry.split("/")[0],
      exp_year: req.body.expiry.split("/")[1],
      cvc: req.body.cvv,
    },
  });

  return res.status(200).json({
    result: result,
  });
};

exports.listPaymentMethods = async (req, res, next) => {
  const list = await StripeMain.ListAllPaymentMethods("cus_NoVup9TQKR9ZJn");
  return res.status(200).json({
    list: list,
  });
};
