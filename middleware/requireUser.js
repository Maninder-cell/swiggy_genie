const jwt = require("jsonwebtoken");

exports.admin = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(400).json({ msg: "Authorization Header is required" });
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req.user = decoded.user;
    req.role = decoded.user.account_type;
    if (req.role === "admin") {
      next();
    } else {
      return res.status(400).json({ msg: "Unauthorised Access" });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ msg: "Invalid Access Key" });
  }
};

exports.customer = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(400).json({ msg: "Authorization Header is required" });
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req.user = decoded.user;
    req.role = decoded.user.account_type;
    if (req.role === "customer") {
      next();
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ msg: "Invalid Access Key" });
  }
};

exports.driver = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(400).json({ msg: "Authorization Header is required" });
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req.user = decoded.user;
    req.role = decoded.user.account_type;
    if (req.role === "driver") {
      next();
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ msg: "Invalid Access Key" });
  }
};

exports.role = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(400).json({ msg: "Authorization Header is required" });
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req.role = decoded.account_type;
    req.id = decoded.id
      next();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ msg: "Invalid Access Key" });
  }
};
