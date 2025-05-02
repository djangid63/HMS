const express = require('express')
const router = express.Router();
const auth = require('../Middleware/auth')

const hotelController = require('../Controllers/hotelController')

// Fixed routes to match frontend requests
router.post('/add', auth, hotelController.addHotel)
router.get('/getAll', auth, hotelController.getAllHotel)
router.put('/update/:id', auth, hotelController.updateHotel)
router.delete('/delete/:id', auth, hotelController.deleteHotel)
// Keeping the original routes for backwards compatibility
router.patch('/updateHotel/:id', auth, hotelController.updateHotel)
router.delete('/softDelete/:id', auth, hotelController.softDelete)
router.delete('/hardDelete/:id', auth, hotelController.hardDelete)

module.exports = router;