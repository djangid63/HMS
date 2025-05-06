const express = require('express')
const router = express.Router()
const auth = require('../Middleware/auth')

const bookingController = require('../Controllers/bookingController')

router.post('/add', auth, bookingController.addBooking)
router.get('/getAll', auth, bookingController.getBooking)

module.exports = router