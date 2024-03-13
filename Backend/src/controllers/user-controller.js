const { generateToken } = require("../config/jwtToken")
const User = require("../models/user-model")
const Product = require("../models/product-model")
const Cart = require("../models/cart-model")
const Coupon = require("../models/coupon-model")
const Order = require("../models/order-model")
const asyncHandler = require("express-async-handler")
const validateMongoDBId = require("../utils/validate-mongodb-id")
const { generateRefreshToken } = require("../config/refresh-token")
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const uniqid = require('uniqid')
const { sendEmail } = require("./email-controller")

const createUser = asyncHandler(async (req, res) => {
  const email =  req.body.email
  const findUser = await User.findOne({email: email})
  
  if(!findUser) {
    const newUser = await  User.create(req.body)
    res.json(newUser)
  }else{
    throw new Error("User already exists")
  }
})

const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body

  const findUser = await User.findOne({email: email})

  if(findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(findUser?._id)

    await User.findByIdAndUpdate(findUser?._id, {
      refreshToken: refreshToken
    }, {new: true})

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000
    })

    res.json({
      id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id)
    })
  }else{
    throw new Error("Invalid credentials")
  }
})

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if(!cookie?.refreshToken){
      throw new Error("No refresh token in cookie")
    }
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({refreshToken})
    if(!user){
      throw new Error("No refresh token presesent inside db or not matched")
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if(err || user.id !== decoded.id){
        throw new Error("There is something wrong with refresh token")
      }
      const accessToken = generateToken(user?._id)
      res.json(accessToken)
    })
})

const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies
  if(!cookie?.refreshToken){
    throw new Error("No refresh token in cookie")
  }
  const refreshToken = cookie.refreshToken
  const user = await User.findOne({refreshToken})
  if(!user){
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true
    })
    return res.sendStatus(204)
  }
  
  await User.findOneAndUpdate({refreshToken}, {
    refreshToken: ""
  })
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true
  })
    return res.sendStatus(204)

})

const fetchUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find()
    res.json(getUsers)
  } catch (error) {
    throw new Error(error)
  }
})

const getUser = asyncHandler(async (req, res) => {
  const {id} = req.params
  validateMongoDBId(id)
  try {
    const user = await User.findById(id)

    res.json(user)
    
  } catch (error) {
    throw new Error(error)
  }
})

const updateUser = asyncHandler(async (req, res) => {
  const {id} = req.user
  validateMongoDBId(id)
  const {firstName, lastName, email, mobile} = req.body

  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email, 
      mobile
    }, {new: true})

    res.json(updatedUser)
  } catch (error) {
    throw new Error(error)
  }
})

const deleteUser = asyncHandler(async (req, res) => {
  const {id} = req.params
  validateMongoDBId(id)

  try {
    const deletedUser = await User.findByIdAndDelete(id)
    res.json(deletedUser)
  } catch (error) {
    throw new Error(error)
  }
})

const blockUser = asyncHandler(async (req, res) => {
  const {id} = req.params
  validateMongoDBId(id)

  try {
    await User.findByIdAndUpdate(id, {
      isBlocked: true
    },{
      new: true
    })
    res.json({
      message: "User blocked successfully"
    })
  }catch(error){
    throw new Error(error)
  }
})

const unblockUser = asyncHandler(async (req, res) => {
  const {id} = req.params
  validateMongoDBId(id)

  try {
    await User.findByIdAndUpdate(id, {
      isBlocked: false
    },{
      new: true
    })
    res.json({
      message: "User unblocked successfully"
    })
  }catch(error){
    throw new Error(error)
  }
})

const updatePassword = asyncHandler(async (req, res) => {
  const {id} = req.user
  const {password} = req.body
  validateMongoDBId(id)
  const user = await User.findById(id)
  if(password){
    user.password = password
    const updatedPassword = await user.save()
    res.json(updatePassword)
  }else{
    res.json(user)
  }
})

const saveAddress = asyncHandler(async (req, res) => {
  const {id} = req.user
  validateMongoDBId(id)
  
  const {address} = req.body

  const user = await User.findById(id)

  if(!user){
    throw new Error("User not found with this id")
  }

 try {
  const updateUser = await User.findByIdAndUpdate(id, {
    address
  }, {
    new: true
  })

  res.json(updateUser)
 } catch (error) {
  throw new Error(error)
 }
})

const forgotPassword = asyncHandler(async (req, res) => {
  const {email} = req.body
  const user = await User.findOne({email})
  if(!user){
    throw new Error("User not found with this email")
  }
  try {
    const token = await user.createPasswordResetToken()
    await user.save()
    const resetUrl = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from now. <a href='http:localhost:4000/api/user/reset-password/${token}'>Click Here</>`
    const data = {
      to: email,
      subsject: "Forgot Password Link",
      text: "Hey there, Please click on the link to reset your password.",
      html: resetUrl
    }
    sendEmail(data)
    res.json(token)
  } catch (error) {
    throw new Error(error)
  }
})

const resetPassword = asyncHandler(async (req, res) => {
  const {password} = req.body
  const {token} = req.params
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now()
    }
  })
  if(!user){
    throw new Error("Token is invalid or has expired, try again later")
  }
  user.password = password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()
  res.json(user)
})

const loginAdmin = asyncHandler(async (req, res) => {
  const {email, password} = req.body

  const findAdmin = await User.findOne({email: email})
  if(findAdmin.role !== 'admin'){
    throw new Error("Not authorized")
  }
  if(findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(findAdmin?._id)

    await User.findByIdAndUpdate(findAdmin?._id, {
      refreshToken: refreshToken
    }, {new: true})

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000
    })

    res.json({
      id: findAdmin?._id,
      firstName: findAdmin?.firstName,
      lastName: findAdmin?.lastName,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id)
    })
  }else{
    throw new Error("Invalid credentials")
  }
})

const getWishList = asyncHandler(async (req, res) => {
  const {id} = req.user
  validateMongoDBId(id)
  try {
    const findUser = await User.findById(id).populate("wishList")
    res.json(findUser)
  }catch(error){
    throw new Error(error)
  }
})

const userCart = asyncHandler(async (req, res) => {
  const {id} = req.user
  const {cart} = req.body
  validateMongoDBId(id)
  try {
    let products = []
    const user = await User.findById(id)
    
    const alreadyExistCart = await Cart.findOne({orderBy: user?._id})
    console.log(alreadyExistCart)
    if(alreadyExistCart){
      alreadyExistCart.deleteOne()
    }


    for(let i = 0; i<cart.length; i++){
      let object = {}
      object.product = cart[i]._id
      object.count = cart[i].count
      let getPrice = await Product.findById(cart[i]._id).select("price").exec()
      object.price = getPrice.price
      products.push(object)
    }

    let cartTotal = 0

    for(let i = 0; i<products.length; i++){
      cartTotal = cartTotal + products[i].price * products[i].count
    }
    
    let newCart = await Cart.create({
      products,
      cartTotal,
      orderBy: user?._id
    })

    res.json(newCart)
  }catch(error){
    throw new Error(error)
  }
})

const getUserCart = asyncHandler(async (req, res) => {
  const{id} = req.user
  validateMongoDBId(id)
  try {
    const cart = await Cart.findOne({orderBy: id}).populate("products.product")

    res.json(cart)
  }catch(error){
    throw new Error(error)
  }
})

const emptyCart =  asyncHandler(async (req, res) => {

  const{id} = req.user
  validateMongoDBId(id)
  try {
    const user = await User.findOne({_id: id})
    const cart = await Cart.findOneAndDelete({orderBy: user?._id})

    res.json(cart)
  }catch(error){
    throw new Error(error)
  }
})

const applyCoupon = asyncHandler(async (req, res) => {
  const {coupon} = req.body
  const {id} = req.user
  validateMongoDBId(id)
  const validCoupon = await Coupon.findOne({name: coupon})

  if(validCoupon === null){
    throw new Error("Invalid coupon")
  }
  const user = await User.findOne({_id: id})

  let {products, cartTotal} = await Cart.findOne({orderBy: user._id}).populate("products.product")

  let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount / 100)).toFixed(2)

  await Cart.findOneAndUpdate(
    {orderBy: user._id},
    {
      totalAfterDiscount
    },
    {new: true}
  )
  res.json(totalAfterDiscount)
})

const createOrder = asyncHandler(async (req, res) => {
  const {COD, couponApplied} = req.body
  const {id} = req.user
  if(!COD){
    throw new Error("Create cash order failed")
  }
  try {
    const user = await User.findById(id)
    
    let userCart = await Cart.findOne({orderBy: user._id})

    let finalAmount = 0

    if(couponApplied && userCart.totalAfterDiscount){
      finalAmount = userCart.totalAfterDiscount * 100
    }else{
      finalAmount = userCart.cartTotal * 100
    }

    await Order.create({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "brl"
      },
      orderBy: user._id,
      orderStatus: "Cash on Delivery"
    })

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      }
    })

    await Product.bulkWrite(update, {})

    res.json({message: "Success"})

  } catch (error) {
    throw new Error(error)
  }
})

const getOrders = asyncHandler(async (req, res) => {
  const {id} = req.user
  validateMongoDBId(id)
  try {
    const userOrders = await Order.findOne({orderBy: id}).populate("products.product")
    res.json(userOrders)
  } catch (error) {
    throw new Error(error)
  }
})

const updateOrderStatus = asyncHandler(async (req, res) => {
  const {status} = req.body
  const {id} = req.params

  validateMongoDBId(id)
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(id, {
      orderStatus: status,
      paymentIntent: {
        status
      }
    }, { new: true})
  
    res.json(updateOrderStatus)
  } catch (error) {
    throw new Error(error)
  }
})


module.exports = {
  createUser,
  loginUser,
  fetchUsers,
  getUser,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  loginAdmin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus
}