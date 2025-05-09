const express = require('express')
const router = express.Router()


const userController = require('../Controllers/userController')

router.post('/signup', userController.SignUpUser)
router.post('/login', userController.login)
router.post('/otp', userController.verifyOtp)
router.post('/forgetPassword', userController.forgetPassword)
router.patch('/resetPassword', userController.resetPassword)
router.get('/getAll', userController.getUser)


module.exports = router;

