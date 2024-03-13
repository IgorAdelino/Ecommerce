const express = require("express")
const { createUser, loginUser, fetchUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logoutUser, updatePassword, forgotPassword, resetPassword, loginAdmin, getWishList, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus } = require("../controllers/user-controller")
const { authMiddleware, isAdmin } = require('../middlewares/auth-middleware')

const router = express.Router()

router.get('/refresh', handleRefreshToken)
router.get('/orders', authMiddleware, getOrders)
router.get('/logout', authMiddleware, logoutUser)
router.get('/cart', authMiddleware, getUserCart)
router.get('/wish-list', authMiddleware, getWishList)
router.get('/:id', authMiddleware, isAdmin, getUser)
router.get('/', fetchUsers)

router.post('/register', createUser)
router.post('/login', loginUser )
router.post('/passwd', authMiddleware, forgotPassword)
router.post('/cart/cash-order', authMiddleware, createOrder)
router.post('/reset-password/:token', authMiddleware, resetPassword)
router.post('/cart', authMiddleware, userCart)
router.post('/admin-login', loginAdmin)
router.post('/cart/apply-coupon', authMiddleware, applyCoupon)


router.put('/address', authMiddleware, saveAddress)
router.put('/orders/:id', authMiddleware, isAdmin, updateOrderStatus)
router.put('/password', authMiddleware, updatePassword)
router.put('/block/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock/:id', authMiddleware, isAdmin, unblockUser)
router.put('/', authMiddleware, updateUser)


router.delete('/empty-cart', authMiddleware, emptyCart)
router.delete('/:id', deleteUser)

module.exports = router