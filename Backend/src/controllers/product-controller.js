const asyncHandler = require("express-async-handler")
const Product = require("../models/product-model")
const User = require("../models/user-model")
const slugify = require("slugify")
const validateMongoDBId = require("../utils/validate-mongodb-id")
const {cloudinaryUploadImg} = require("../utils/cloudinary")
const fs = require('fs')
const createProduct = asyncHandler(async (req, res) => {
  try {
    if(req.body.title){
      req.body.slug = slugify(req.body.title)
    }
    const newProduct = await Product.create(req.body)
    res.json(newProduct)
  } catch (error) {
    throw new Error(error)
  }
})

const updateProduct = asyncHandler(async (req, res) => {
  const {id} = req.params
  try {
    const productInDatabase = await Product.findById(id)

    if(!productInDatabase){
      throw new Error("Product not found")
    }

    if(req.body.title){
      req.body.slug = slugify(req.body.title)
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {new: true})

    res.json(updateProduct)
  } catch (error) {
    throw new Error(error)
  
  }
})

const deleteProduct = asyncHandler(async (req, res) => {
  const {id} = req.params
  try {
    
    const productInDatabase = await Product.findById(id)
    
    if(!productInDatabase){
      throw new Error("Product not found")
    }

    await Product.findOneAndDelete(id)
    res.sendStatus(204)
  } catch (error) {
    throw new Error(error)
  }
})

const getAProduct = asyncHandler(async (req, res) => {
  const {id} = req.params
  try {
      const productInDatabase = await Product.findById(id)

      if(!productInDatabase){
        throw new Error("Product not found")
      }

      res.json(productInDatabase)

  } catch (error) {
    throw new Error(error)
  }
})



const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query }
    const excludedFields = ["page", "sort", "limit", "fields"]
    excludedFields.forEach((el) => delete queryObj[el])

    let querString = JSON.stringify(queryObj)
    queryStr = querString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    let query = Product.find(JSON.parse(queryStr))

    // sorting

    if(req.query.sort){
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    }else{
      query = query.sort("-createdAt")
    }

    // limiting the fields

    if(req.query.fields){
      const fields = req.query.fields.split(",").join(" ")
      query = query.select(fields)
    }else{
      query=query.select("-__v")
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;

    if(req.query.page){
      const productCount = await Product.countDocuments()
      if(skip >= productCount) throw new Error("This page does not exist")
    }
    query = query.skip(skip)

    const product = await query

    res.json(product)
  }catch(error){
    throw new Error(error)
  }
})

const addToWishList = asyncHandler(async (req, res) => {
  const  {id}  = req.user
  const productId = req.params.id
  try {
    const  user = await User.findById(id)
 
    const alreadyAdded = user?.wishList?.find((id) => id.toString() === productId)
    if(alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        id, {
          $pull: {wishList: productId}
        }, {
          new: true
        }
      )
      return res.json(user)
    }else{
      let user = await User.findByIdAndUpdate(
        id, {
          $push: {wishList: productId}
        }, {
          new: true
        }
      )
      return res.json(user)
    }
  } catch (error) {
    throw new Error(error)
  }
})

const rating = asyncHandler(async (req, res) => {
  const {id} = req.user
  const productId = req.params.id
  const {star, comment} = req.body
 try {
  const product = await Product.findById(productId)

  let alreadyRated = product?.ratings?.find((userId) => userId.postedBy.toString() === id)
  if(alreadyRated){

     await Product.updateOne(
      { "ratings": { $elemMatch: alreadyRated } },
      { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
      { new: true }
    );

  }else {
     await Product.findByIdAndUpdate(productId, {
      $push: {ratings: {star: star, postedBy: id}}
    }, {
      new: true
    })
  }
  const getAllRatings = await Product.findById(productId)
  const totalRatings = getAllRatings.ratings.length
  const ratingSum = getAllRatings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0)

  const actualRating = Math.round(ratingSum/ totalRatings)

  const finalProduct = await Product.findByIdAndUpdate(productId, {
    totalRating: actualRating,
  })

  res.json(finalProduct)
 } catch (error) {
  throw new Error(error)
 }

})

const uploadImages = asyncHandler(async (req, res) => {
  const {id} = req.params;
  validateMongoDBId(id)
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images")
    const urls = []
    const files = req.files
    for (const file of files) {
      const { path } = file
      const newPath = await uploader(path)
      urls.push(newPath)
      fs.unlinkSync(path)
    }
    const findProduct = await Product.findByIdAndUpdate(id, {
      images: urls.map((file) => {
        return {
          url: file
        }
      })
    }, {
      new: true
    })

    res.json(findProduct)
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = {
  createProduct, 
  getAProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages
}