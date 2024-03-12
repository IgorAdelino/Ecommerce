const express = require("express")
const { createCoupon, updateCoupon, fetchCoupons, deleteCoupon, getCoupon } = require("../controllers/coupon-controller")
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware")
const router = express.Router()

router.post('/', authMiddleware, isAdmin, createCoupon)
router.get('/', authMiddleware, isAdmin, fetchCoupons)
router.put('/:id', authMiddleware, isAdmin, updateCoupon)
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon)


module.exports = router