const express = require("express")
const { createUser, loginUser, fetchUsers, getUser, deleteUser, updateUser } = require("../controllers/user-controller")
const { authMiddleware } = require('../middlewares/auth-middleware')

const router = express.Router()
router.post('/register', createUser)
router.post('/login', loginUser )
router.get('/all', fetchUsers)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

router.get('/:id', authMiddleware, getUser)
module.exports = router