require('dotenv').config()
const userModel = require('../Models/userModel')
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET

// For debugging purposes
// console.log('Auth Middleware loaded with JWT_SECRET:', secretKey ? 'Secret key is set' : 'SECRET KEY IS MISSING!');

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

    // console.log(`Verifying token: ${token.substring(0, 10)}...`);

    try {
      const decodeToken = jwt.verify(token, secretKey);
      // console.log('Token verified successfully, email:', decodeToken.email);

      const user = await userModel.findOne({ email: decodeToken.email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      // console.log('Invalid JWT token error:', jwtError.message);
      // Special handling for image upload routes - allow without authentication temporarily
      // if (req.originalUrl.includes('/room/upload-images')) {
      //   console.log('Bypassing auth for image upload temporarily');
      //   next();
      // } else {
      //   return res.status(401).json({ message: "Invalid token" });
      // }
    }
  } catch (error) {
    console.log("Auth middleware error:", error.message);
    return res.status(500).json({ message: "Authentication error" });
  }
}
