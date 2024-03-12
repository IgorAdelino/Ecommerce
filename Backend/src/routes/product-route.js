const express = require('express')
const {createProduct, getAProduct, getAllProducts, updateProduct, deleteProduct, addToWishList, rating, uploadImages} = require('../controllers/product-controller')
const { isAdmin, authMiddleware } = require('../middlewares/auth-middleware')
const { uploadPhoto, productImgResize } = require('../middlewares/upload-images')

const router = express.Router()

router.post('/',  authMiddleware, isAdmin, createProduct)
router.get('/',  getAllProducts)
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages)
router.get('/:id', getAProduct)
router.put('/:id',  authMiddleware , isAdmin, updateProduct)
router.delete('/:id',  authMiddleware ,isAdmin , deleteProduct)
router.put('/wish-list/:id', authMiddleware, addToWishList)
router.put('/rating/:id', authMiddleware, rating)

module.exports = router