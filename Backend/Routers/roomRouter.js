const express = require('express')
const router = express.Router()
const auth = require('../Middleware/auth')

const roomController = require('../Controllers/roomController')

router.post('/add', auth, roomController.addRoom)
router.patch('/update', auth, roomController.updateRoom)
router.get('/getAll', auth, roomController.getAllRooms)

router.delete('/delete/:id', auth, roomController.deleteRoom)
router.delete('/disable/:id', auth, roomController.disableRoom)

module.exports = router
