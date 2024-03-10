const express = require("express")
const { createBlogCategory, updateBlogCategory, fetchBlogCategories, deleteBlogCategory, getBlogCategory } = require("../controllers/blog-category-controller")
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware")
const router = express.Router()

router.post('/', authMiddleware, isAdmin, createBlogCategory)
router.put('/:id', authMiddleware, isAdmin, updateBlogCategory)
router.get('/', fetchBlogCategories)
router.delete('/:id', authMiddleware, isAdmin, deleteBlogCategory)
router.get('/:id', getBlogCategory)

module.exports = router