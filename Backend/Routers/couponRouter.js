const express = require('express')
const router = express.Router();
const auth = require('../Middleware/auth')

const couponController = require('../Controllers/couponController')

router.get('/getAll', auth, couponController.getCoupon)
router.post('/addCoupon', auth, couponController.addCoupon)
router.patch('/updateCoupon/:id', auth, couponController.updateCoupon)
router.delete('/deleteCoupon/:id', auth, couponController.deleteCoupon)
router.delete('/disableCoupon/:id', auth, couponController.disableCoupon)


module.exports = router