const express = require('express')
const {createProduct, getAProduct, getAllProducts, updateProduct, deleteProduct} = require('../controllers/product-controller')
const { isAdmin, authMiddleware } = require('../middlewares/auth-middleware')

const router = express.Router()

router.post('/',  authMiddleware, isAdmin, createProduct)
router.get('/',  getAllProducts)
router.get('/:id', getAProduct)
router.put('/:id',  authMiddleware , isAdmin, updateProduct)
router.delete('/:id',  authMiddleware ,isAdmin , deleteProduct)

module.exports = router