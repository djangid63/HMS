const express = require('express')
const router = express.Router()

const userController = require('../Controllers/userController')

router.post('/signup', userController.SignUpUser)
router.post('/login', userController.login)
router.post('/otp', userController.verifyOtp)
router.post('/forgetPassword', userController.forgetPassword)
router.post('/resetOtp', userController.resetPassword)


module.exports = router;

