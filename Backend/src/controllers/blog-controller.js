const Blog = require('../models/blog-model')
const User = require('../models/user-model')
const validateMongoDBId = require("../utils/validate-mongodb-id")
const asyncHandler = require("express-async-handler")

const createBlog = asyncHandler(async (req,res) => {
  try {
    const newBlog = await Blog.create(req.body)
    res.json({
      message: "Blog created successfully",
      newBlog
    })
  } catch (error) {
    throw new Error(error)
  }
})

const updateBlog = asyncHandler(async (req,res) => {
  const { id } = req.params
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true
    })
    res.json(updateBlog)
  } catch (error) {
    throw new Error(error)
  }
})

const getBlog = asyncHandler(async (req,res) => {
  const { id } = req.params
  try {
    const getBlog = await Blog.findById(id).populate("likes").populate("dislikes")
    await Blog.findByIdAndUpdate(id, {
      $inc: {
        numberOfViews: 1
      }
    }, {
      new: true
    })  
    res.json(getBlog)
  } catch (error) {
    throw new Error(error)
  }
})

const fetchBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find()
    res.json(blogs)
  } catch (error) {
    throw new Error(error)
  }
})

const deleteBlog = asyncHandler(async (req,res) => {
  const { id } = req.params
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id)
    res.json(deletedBlog)
  } catch (error) {
    throw new Error(error)
  }
})

const likeBlog = asyncHandler(async (req, res) => {
  const {id} = req.params
  
  const blog = await Blog.findById(id)
  
  const loginUserId = req.user?.id 

  const isLiked = blog?.isLiked
  const alreadyDisliked = blog?.dislikes?.find(userId => userId?.toString() === loginUserId)
  const isDisliked = blog?.isDisliked

  if(alreadyDisliked || isDisliked){
    const blog = await Blog.findByIdAndUpdate(id, {
      $pull: {dislikes: loginUserId},
      isDisliked: false
    }, {
      new: true
    })
    return res.json(blog)
  }

  if(isLiked){
    const blog = await Blog.findByIdAndUpdate(id, {
      $pull: {likes: loginUserId},
      isLiked: false
    }, {
      new: true
    })
    return res.json(blog)
  }else{
    const blog = await Blog.findByIdAndUpdate(id, {
      $push: {likes: loginUserId},
      isLiked: true
    }, {
      new: true
    })
    return res.json(blog)
  }
})

const dislikeBlog = asyncHandler(async (req, res) => {
  const {id} = req.params
  
  const blog = await Blog.findById(id)
  
  const loginUserId = req.user?.id 

  const isLiked = blog?.isLiked
  const alreadyLiked = blog?.likes?.find(userId => userId?.toString() === loginUserId)
  const isDisliked = blog?.isDisliked

  if(alreadyLiked || isLiked){
    const blog = await Blog.findByIdAndUpdate(id, {
      $pull: {likes: loginUserId},
      isLiked: false
    }, {
      new: true
    })
    return res.json(blog)
  }

  if(isDisliked){
    const blog = await Blog.findByIdAndUpdate(id, {
      $pull: {dislikes: loginUserId},
      isDisliked: false
    }, {
      new: true
    })
    return res.json(blog)
  }else{
    const blog = await Blog.findByIdAndUpdate(id, {
      $push: {dislikes: loginUserId},
      isDisliked: true
    }, {
      new: true
    })
    return res.json(blog)
  }
})

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  fetchBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog
}