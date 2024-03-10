const ProductCategory = require('../models/product-category-model')
const validateMongoDBId = require("../utils/validate-mongodb-id")
const asyncHandler = require("express-async-handler")

const createProductCategory = asyncHandler(async (req, res) => {
  try {
    const newProductCategory = await ProductCategory.create(req.body)
    res.json(newProductCategory)
  } catch (error) {
    throw new Error(error)
  }
})

const updateProductCategory = asyncHandler(async (req,res) => {
  const { id } = req.params
  try {
    const updateProductCategory = await ProductCategory.findByIdAndUpdate(id, req.body, {
      new: true
    })
    res.json(updateProductCategory)
  } catch (error) {
    throw new Error(error)
  }
})

const fetchProductCategories = asyncHandler(async (req, res) => {
  try {
    const ProductCategories = await ProductCategory.find()
    res.json(ProductCategories)
  } catch (error) {
    throw new Error(error)
  }
})

const getProductCategory = asyncHandler(async (req, res) => {
  const {id} = req.params
  validateMongoDBId(id)
  try {
    const productCategory = await ProductCategory.findById(id)

    res.json(productCategory)
    
  } catch (error) {
    throw new Error(error)
  }
})

const deleteProductCategory = asyncHandler(async (req,res) => {
  const { id } = req.params
  try {
    const deletedProductCategory = await ProductCategory.findByIdAndDelete(id)
    res.json(deletedProductCategory)
  } catch (error) {
    throw new Error(error)
  }
})




module.exports = {
  createProductCategory,
  updateProductCategory,
  fetchProductCategories,
  deleteProductCategory,
  getProductCategory
}