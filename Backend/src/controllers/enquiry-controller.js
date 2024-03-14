const Enquiry = require('../models/enquiry-model')
const validateMongoDBId = require("../utils/validate-mongodb-id")
const asyncHandler = require("express-async-handler")

const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body)
    res.json(newEnquiry)
  } catch (error) {
    throw new Error(error)
  }
})

const updateEnquiry = asyncHandler(async (req,res) => {
  const {title} = req.body
  const { id } = req.params
  try {
    const updateEnquiry = await Enquiry.findByIdAndUpdate(id, {title}, {
      new: true
    })
    res.json(updateEnquiry)
  } catch (error) {
    throw new Error(error)
  }
})

const fetchEnquiries = asyncHandler(async (req, res) => {
  try {
    const Enquiries = await Enquiry.find()
    res.json(Enquiries)
  } catch (error) {
    throw new Error(error)
  }
})

const getEnquiry = asyncHandler(async (req, res) => {
  const {id} = req.params
  validateMongoDBId(id)
  try {
    const enquiry = await Enquiry.findById(id)

    res.json(enquiry)
    
  } catch (error) {
    throw new Error(error)
  }
})

const deleteEnquiry = asyncHandler(async (req,res) => {
  const { id } = req.params
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id)
    res.json(deletedEnquiry)
  } catch (error) {
    throw new Error(error)
  }
})


module.exports = {
  createEnquiry,
  updateEnquiry,
  fetchEnquiries,
  deleteEnquiry,
  getEnquiry
}