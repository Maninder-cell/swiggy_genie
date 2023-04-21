const StripeMain = require("../services/stripe");

exports.createCustomer = async (req, res, next) => {
  const {customer,error} = await StripeMain.createCustomer({
    name: req.body.name,
    email: req.body.email,
    payment_method: {
      type: "card",
      card: {
        number: req.body.number,
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
  const payment = await StripeMain.Pay(
    100,
    "cus_Nk47G3wCRLsJrV",
    "pm_1MyZziJC7o9g4pD4LJiBiQaX"
  );
  return res.status(200).json({
    payment: payment,
  });
};

exports.newPaymentMethod = async (req, res, next) => {
  const result = await StripeMain.NewPaymentMethod("cus_Nk47G3wCRLsJrV", {
    type: "card",
    card: {
      number: "5555555555554444",
      exp_month: 12,
      exp_year: 2028,
      cvc: "985",
    },
  });

  return res.status(200).json({
    result: result,
  });
};

exports.listPaymentMethods = async (req, res, next) => {
  const list = await StripeMain.ListAllPaymentMethods("cus_Nk47G3wCRLsJrV");
  return res.status(200).json({
    list: list,
  });
};
