require('dotenv').config()
const userModel = require('../Models/userModel')
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET


module.exports = async (req, res, next) => {
  try {
    const barrierToken = req.headers.authorization;
    if (!barrierToken) {
      return res.status(404).json({ message: "No token provided" })
    }

    const token = barrierToken.split(" ")[1];
    if (!token) {
      return res.status(404).json({ message: "No token found!" })
    }
    const decodeToken = jwt.verify(token, secretKey);
    // console.log('Token verified successfully, email:', decodeToken.email);

    const user = await userModel.findOne({ email: decodeToken.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth middleware error:", error.message);
    return res.status(500).json({ message: "Authentication error" });
  }
}
