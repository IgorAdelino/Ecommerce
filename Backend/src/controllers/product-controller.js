const asyncHandler = require("express-async-handler")
const Product = require("../models/product-model")
const slugify = require("slugify")

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



module.exports = {
  createProduct, 
  getAProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
}