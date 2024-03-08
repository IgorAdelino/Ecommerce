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
    const allProducts = await Product.find()

    res.json(allProducts)
  }catch(error){
    throw new Error(error)
  }
})

module.exports = {
  createProduct, 
  getAProduct,
  getAllProducts
}