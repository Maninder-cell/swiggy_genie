require("dotenv").config();

const stripe = require("stripe")(process.env.stripe_secret_key);

exports.createCustomer = async (req, res, next) => {
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: {
      number: "4242424242424242",
      exp_month: 12,
      exp_year: 2024,
      cvc: "987",
    },
  });

  const customer = await stripe.customers.create({
    name: "Maninder",
    email: "manindermatharu2001@gmail.com",
    payment_method: paymentMethod.id,
    invoice_settings: {
      default_payment_method: paymentMethod.id
    }
  });

  return res.status(200).json({
    customer: customer,
  });
};

exports.pay = async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100 * 100000,
    currency: "usd",
    confirm: true,
    customer: "cus_Nk47G3wCRLsJrV",
    payment_method: "pm_1MyZziJC7o9g4pD4LJiBiQaX",
    payment_method_types: ["card"],
  });

  return res.status(200).json({
    payment: paymentIntent,
  });
};
