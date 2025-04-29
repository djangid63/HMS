const express = require('express')
const router = express.Router();

const locationController = require('../Controllers/locationController')


router.post('/addLocation', locationController.addLocation)
router.get('/getAllLocation', locationController.getAllLocations)
router.delete('/softDelete/:id', locationController.softDelete)
router.delete('/hardDelete/:id', locationController.hardDelete)

module.exports = router;