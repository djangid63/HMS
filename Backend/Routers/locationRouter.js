const express = require('express')
const router = express.Router();
const auth = require('../Middleware/auth')

const locationController = require('../Controllers/locationController')


router.post('/addLocation', auth, locationController.addLocation)
router.get('/getAllLocation', auth, locationController.getAllLocations)
router.patch('/updateLocation/:id', auth, locationController.updateLocation)
router.delete('/softDelete/:id', auth, locationController.softDelete)
router.delete('/hardDelete/:id', auth, locationController.hardDelete)

module.exports = router;