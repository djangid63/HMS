const express = require('express')
const router = express.Router();
const auth = require('../Middleware/auth')

const stateController = require('../Controllers/stateController')


router.post('/addLocation', auth, stateController.addLocation)
router.get('/getAllLocation', auth, stateController.getAllLocations)
router.patch('/updateLocation/:id', auth, stateController.updateLocation)
router.delete('/softDelete/:id', auth, stateController.softDelete)
router.delete('/hardDelete/:id', auth, stateController.hardDelete)

module.exports = router;