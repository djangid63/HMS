const express = require('express')
const router = express.Router()
const auth = require('../Middleware/auth')

const bookingController = require('../Controllers/BookingController')


router.post('/add', auth, bookingController.addHotel)
router.get('/getAll', auth, bookingController.getAllHotel)

module.exports = router