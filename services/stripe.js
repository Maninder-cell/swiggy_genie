require("dotenv").config();

const stripe = require("stripe")(process.env.stripe_secret_key);

class StripeMain {
  /**
   * @param {object} customer - The customer object with payment_method property
   */
  static async createCustomer(customer) {
    const paymentMethod = await stripe.paymentMethods.create(
      customer.payment_method
    );
    customer["payment_method"] = paymentMethod.id;
    customer["invoice_settings"] = {};
    customer["invoice_settings"]["default_payment_method"] = paymentMethod.id;
    const customer_obj = await stripe.customers.create(customer);

    return customer_obj;
  }

  /**
   * @param {int} amount - amount in usd
   * @param {string} customer - customer id
   * @param {string} payment_method - payment method id
   */
  static async Pay(amount, customer, payment_method) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      confirm: true,
      customer: customer,
      payment_method: payment_method,
      payment_method_types: ["card"],
    });

    return paymentIntent;
  }

  /**
   * @param {string} customer - customer id
   * @param {object} payment_method - payment method object
   */

  static async NewPaymentMethod(customer, payment_method) {
    const paymentMethod = await stripe.paymentMethods.create(payment_method);

    const attach = await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer,
    });

    return attach;
  }

  static async ListAllPaymentMethods(customer) {
    const paymentMethods = await stripe.customers.listPaymentMethods(customer, {
      type: "card",
    });

    return paymentMethods;
  }
}

module.exports = StripeMain;
