const express = require("express")
const { createUser, loginUser, fetchUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logoutUser, updatePassword, forgotPassword, resetPassword, loginAdmin, getWishList, saveAddress, userCart, getUserCart } = require("../controllers/user-controller")
const { authMiddleware, isAdmin } = require('../middlewares/auth-middleware')

const router = express.Router()
router.get('/refresh', handleRefreshToken)
router.post('/register', createUser)
router.post('/login', loginUser )
router.delete('/:id', deleteUser)
router.get('/all', fetchUsers)
router.get('/logout', authMiddleware, logoutUser)
router.put('/', authMiddleware, updateUser)
router.put('/address', authMiddleware, saveAddress)
router.put('/password', authMiddleware, updatePassword)
router.post('/passwd', authMiddleware, forgotPassword)
router.post('/cart', authMiddleware, userCart)
router.get('/cart', authMiddleware, getUserCart)
router.post('/reset-password/:token', authMiddleware, resetPassword)
router.get('/wish-list', authMiddleware, getWishList)
router.get('/:id', authMiddleware, isAdmin, getUser)
router.put('/block/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock/:id', authMiddleware, isAdmin, unblockUser)

router.post('/admin-login', loginAdmin)


module.exports = router