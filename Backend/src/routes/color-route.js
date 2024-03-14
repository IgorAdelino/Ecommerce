const express = require("express")
const { createColor, updateColor, fetchColors, deleteColor, getColor } = require("../controllers/color-controller")
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware")
const router = express.Router()

router.post('/', authMiddleware, isAdmin, createColor)
router.put('/:id', authMiddleware, isAdmin, updateColor)
router.get('/', fetchColors)
router.delete('/:id', authMiddleware, isAdmin, deleteColor)
router.get('/:id', getColor)

module.exports = router