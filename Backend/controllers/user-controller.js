const { generateToken } = require("../config/jwtToken")
const User = require("../models/user-model")
const asyncHandler = require("express-async-handler")

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

const fetchUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find()
    res.json(getUsers)
  } catch (error) {
    throw new Error(error)
  }
})

const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
  
      res.json(user)
    
  } catch (error) {
    throw new Error(error)
  }
})

const updateUser = asyncHandler(async (req, res) => {
  const {id} = req.params
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
  try {
    const deletedUser = await User.findByIdAndDelete(id)
    res.json(deletedUser)
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
  deleteUser
}