const Color = require('../models/color-model')
const validateMongoDBId = require("../utils/validate-mongodb-id")
const asyncHandler = require("express-async-handler")

const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body)
    res.json(newColor)
  } catch (error) {
    throw new Error(error)
  }
})

const updateColor = asyncHandler(async (req,res) => {
  const {title} = req.body
  const { id } = req.params
  try {
    const updateColor = await Color.findByIdAndUpdate(id, {title}, {
      new: true
    })
    res.json(updateColor)
  } catch (error) {
    throw new Error(error)
  }
})

const fetchColors = asyncHandler(async (req, res) => {
  try {
    const Colors = await Color.find()
    res.json(Colors)
  } catch (error) {
    throw new Error(error)
  }
})

const getColor = asyncHandler(async (req, res) => {
  const {id} = req.params
  validateMongoDBId(id)
  try {
    const color = await Color.findById(id)

    res.json(color)
    
  } catch (error) {
    throw new Error(error)
  }
})

const deleteColor = asyncHandler(async (req,res) => {
  const { id } = req.params
  try {
    const deletedColor = await Color.findByIdAndDelete(id)
    res.json(deletedColor)
  } catch (error) {
    throw new Error(error)
  }
})


module.exports = {
  createColor,
  updateColor,
  fetchColors,
  deleteColor,
  getColor
}