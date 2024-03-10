const express = require("express")
const { createProductCategory, updateProductCategory, fetchProductCategories, deleteProductCategory, getProductCategory } = require("../controllers/product-category-controller")
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware")
const router = express.Router()

router.post('/', authMiddleware, isAdmin, createProductCategory)
router.put('/:id', authMiddleware, isAdmin, updateProductCategory)
router.get('/', fetchProductCategories)
router.delete('/:id', authMiddleware, isAdmin, deleteProductCategory)
router.get('/:id', getProductCategory)

module.exports = router