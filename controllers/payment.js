const StripeMain = require("../services/stripe");

exports.createCustomer = async (req, res, next) => {
  const customer = await StripeMain.createCustomer({
    name: "Maninder",
    email: "manindermatharu2001@gmail.com",
    payment_method: {
      type: "card",
      card: {
        number: "4242424242424242",
        exp_month: 12,
        exp_year: 2024,
        cvc: "987",
      },
    },
  });

  return res.status(200).json({
    customer: customer,
  });
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
