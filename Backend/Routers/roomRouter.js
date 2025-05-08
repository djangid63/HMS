const express = require('express')
const router = express.Router()
const auth = require('../Middleware/auth')

const roomController = require('../Controllers/roomController')

router.post('/add', auth, roomController.addRoom)
router.patch('/update/:id', auth, roomController.updateRoom)
router.get('/getAll', roomController.getAllRooms)
router.post('/upload-images', auth, roomController.uploadImages) 

router.delete('/delete/:id', auth, roomController.deleteRoom)
router.delete('/disable/:id', auth, roomController.disableRoom)

module.exports = router
