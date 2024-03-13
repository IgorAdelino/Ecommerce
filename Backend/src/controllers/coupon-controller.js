const Coupon = require('../models/coupon-model')
const validateMongoDbId = require('../utils/validate-mongodb-id')
const asyncHandler = require("express-async-handler")

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body)
    res.json(newCoupon)
  }catch(error){
    throw new Error(error)
  }
})

const fetchCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find()
    res.json(coupons)
  } catch (error) {
    throw new Error(error)
  }
})

const updateCoupon = asyncHandler(async (req,res) => {
  const { id } = req.params
  try {
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true
    })
    res.json(updateCoupon)
  } catch (error) {
    throw new Error(error)
  }
})

const deleteCoupon = asyncHandler(async (req,res) => {
  const { id } = req.params
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(id)
    res.json(deletedCoupon)
  } catch (error) {
    throw new Error(error)
  }
})



module.exports ={
  createCoupon,
  fetchCoupons,
  updateCoupon,
  deleteCoupon
}