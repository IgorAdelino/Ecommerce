const express = require("express")
const { authMiddleware, isAdmin } = require('../middlewares/auth-middleware')
const { createBlog, updateBlog, getBlog, fetchBlogs, deleteBlog, likeBlog, dislikeBlog } = require("../controllers/blog-controller")

const router = express.Router()

router.post('/', authMiddleware, isAdmin, createBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.get('/:id', getBlog )
router.get('/', fetchBlogs)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)
router.put('/like/:id', authMiddleware, likeBlog)
router.put('/dislike/:id', authMiddleware, dislikeBlog)

module.exports = router