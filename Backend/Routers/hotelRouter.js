const express = require('express')
const router = express.Router();
const auth = require('../Middleware/auth')

const hotelController = require('../Controllers/hotelController')

router.post('/add', auth, hotelController.addHotel)
router.get('/getAll', hotelController.getAllHotel)
router.put('/update/:id', auth, hotelController.updateHotel)
router.delete('/delete/:id', auth, hotelController.deleteHotel)
router.patch('/softDelete/:id', auth, hotelController.softDelete)

module.exports = router;