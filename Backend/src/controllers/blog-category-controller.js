const BlogCategory = require('../models/blog-category-model')
const validateMongoDBId = require("../utils/validate-mongodb-id")
const asyncHandler = require("express-async-handler")

const createBlogCategory = asyncHandler(async (req, res) => {
  try {
    const newBlogCategory = await BlogCategory.create(req.body)
    res.json(newBlogCategory)
  } catch (error) {
    throw new Error(error)
  }
})

const updateBlogCategory = asyncHandler(async (req,res) => {
  const { id } = req.params
  try {
    const updateBlogCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {
      new: true
    })
    res.json(updateBlogCategory)
  } catch (error) {
    throw new Error(error)
  }
})

const fetchBlogCategories = asyncHandler(async (req, res) => {
  try {
    const BlogCategories = await BlogCategory.find()
    res.json(BlogCategories)
  } catch (error) {
    throw new Error(error)
  }
})

const getBlogCategory = asyncHandler(async (req, res) => {
  const {id} = req.params
  validateMongoDBId(id)
  try {
    const blogCategory = await BlogCategory.findById(id)

    res.json(blogCategory)
    
  } catch (error) {
    throw new Error(error)
  }
})

const deleteBlogCategory = asyncHandler(async (req,res) => {
  const { id } = req.params
  try {
    const deletedBlogCategory = await BlogCategory.findByIdAndDelete(id)
    res.json(deletedBlogCategory)
  } catch (error) {
    throw new Error(error)
  }
})


module.exports = {
  createBlogCategory,
  updateBlogCategory,
  fetchBlogCategories,
  deleteBlogCategory,
  getBlogCategory
}