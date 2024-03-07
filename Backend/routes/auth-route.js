const express = require("express")
const { createUser, loginUser, fetchUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken } = require("../controllers/user-controller")
const { authMiddleware, isAdmin } = require('../middlewares/auth-middleware')

const router = express.Router()
router.get('/refresh', handleRefreshToken)
router.post('/register', createUser)
router.post('/login', loginUser )
router.delete('/:id', deleteUser)
router.get('/all', fetchUsers)
router.get('/:id', authMiddleware, isAdmin, getUser)
router.put('/', authMiddleware, updateUser)
router.put('/block/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock/:id', authMiddleware, isAdmin, unblockUser)


module.exports = router