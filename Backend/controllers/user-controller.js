const { generateToken } = require("../config/jwtToken")
const User = require("../models/user-model")
const asyncHandler = require("express-async-handler")
const validateMongoDBId = require("../utils/validate-mongodb-id")
const { generateRefreshToken } = require("../config/refresh-token")
const jwt = require("jsonwebtoken")

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


module.exports = {
  createUser,
  loginUser,
  fetchUsers,
  getUser,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  handleRefreshToken
}