const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

     req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: "Missing authorization header" });
  }
};



module.exports = verifyToken;