const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/authRoute");
const orderRoutes = require("./Routes/oderListRoute");
const path = require('path');
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(express.json());

app.use("/auth", authRoutes);
app.use(orderRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));

