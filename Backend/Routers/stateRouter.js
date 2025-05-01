const express = require('express')
const router = express.Router();
const auth = require('../Middleware/auth')

const stateController = require('../Controllers/stateController')


router.post('/addState', auth, stateController.addState)
router.get('/getAllState', auth, stateController.getAllStates)
router.patch('/updateState/:id', auth, stateController.updateState)
router.delete('/softDelete/:id', auth, stateController.softDelete)
router.delete('/hardDelete/:id', auth, stateController.hardDelete)

module.exports = router;