require('dotenv').config()
const userModel = require('../Models/userModel')
const bcrypt = require('bcrypt')
const moment = require('moment')
const { sendOtpEmail, sendCreationEmail, sendStatusUpdateEmail } = require('../Utils/emailService')
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET

exports.SignUpUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, gender, age, role } = req.body
    const isMailExists = await userModel.findOne({ email })

    if (isMailExists) {
      return res.status(409).json({ status: false, message: "Email already exists" })
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt)
    const otp = Math.floor((Math.random() * 9000) + (1000 - 1));
    const currTimer = moment()
    const otpTimer = currTimer.clone().add(10, "minutes");

    if (!role || role === '' || role === 'user') {
      const emailSent = await sendOtpEmail(email, otp, firstname);
      if (!emailSent) {
        return res.status(500).json({ success: false, message: "Failed to send OTP email" });
      }
    }

    const signData = new userModel({
      firstname,
      lastname,
      email,
      gender,
      age,
      password: hashedPassword,
      role: role || 'user',
      otp,
      otpTimer
    })
    const userData = new userModel(signData)
    const saveData = await userData.save()
    return res.status(201).json({ success: true, message: "Sign up successfully", data: saveData })
  } catch (error) {
    console.log("User sign up failed:", error);
    return res.status(400).json({
      success: false,
      message: "Sign up failed",
      error: error.message || "An unexpected error occurred"
    })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(404).json({ success: false, message: "Please sign up first to continue" })
    }

    if (user.isDisabled) {
      return res.status(403).json({ success: false, message: "Your Access Has Been Revoked Please Contact The Owner" })
    }

    const dbPassword = user.password
    const isMatch = bcrypt.compareSync(password, dbPassword)

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Password is incorrect" });
    }
    // Token With expiry timer
    // const token = jwt.sign({ email: user.email, role: user.role }, secretKey, { expiresIn: '1h' });

    // Token Without expiry timer
    const token = jwt.sign({ email: user.email, role: user.role }, secretKey);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role
    });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message || "An unexpected error occurred"
    });
  }
}

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(404).json({ success: false, message: "No user found please log in to continue" })
    }

    const dbOtp = user.otp;
    if (dbOtp != otp) {
      return res.status(200).json({ success: false, message: "OTP does not match" })
    }

    const currentTime = moment();
    const otpExpiry = moment(user.otpTimer);

    if (currentTime.isAfter(otpExpiry)) {
      return res.status(401).json({ success: false, message: "OTP has expired" });
    }

    return res.status(200).json({ success: true, message: "OTP verified successfully" })

  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json(
      {
        success: false,
        message: "Login failed",
        error: error.message || "An unexpected error occurred"
      });
  }
}

exports.forgetPassword = async (req, res) => {

  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "No user found please log in to continue" })
    }

    const otp = Math.floor((Math.random() * 9000) + (1000 - 1))
    const currTime = moment();
    const otpTimer = currTime.clone().add(10, 'minute')

    user.otp = otp
    user.otpTimer = otpTimer
    await user.save()

    // Updated to match new emailService function signature
    const emailSent = await sendOtpEmail(email, otp, user.firstname);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }
    return res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.log("Forget password error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process request",
      error: error.message || "An unexpected error occurred"
    });
  }
}

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  console.log(email, otp, newPassword);

  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: "No user found" });
    }

    const dbOtp = user.otp;
    if (dbOtp != otp) {
      return res.status(400).json({ success: false, message: "OTP does not match" });
    }

    const currentTime = moment();
    const otpExpiry = moment(user.otpTimer);
    if (currentTime.isAfter(otpExpiry)) {
      return res.status(401).json({ success: false, message: "OTP has expired" });
    }

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    user.otp = null;
    user.otpTimer = null;
    await user.save();

    return res.status(200).json({ status: true, message: "Password Reset successfully" })

  } catch (error) {
    console.log("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Password reset failed",
      error: error.message || "An unexpected error occurred"
    });
  }
}

exports.getUser = async (req, res) => {
  try {
    const userData = await userModel.find()
    return res.status(201).json({ success: true, message: "User successfully fetched", data: userData })
  } catch (error) {
    console.log("User fetch failed:", error);
    return res.status(500).json({
      success: false,
      message: "User fetch failed",
      error: error.message || "An unexpected error occurred"
    });
  }

}