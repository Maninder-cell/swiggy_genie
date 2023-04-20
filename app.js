const express = require("express");
const path = require("path");
const paymentRoutes = require("./routes/payment");
const feedbackRoutes = require("./routes/feedback");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/payment", paymentRoutes);
app.use("/feedback", feedbackRoutes);

if (require.main === module) {
  app.listen(3000);
}

module.exports = app;
