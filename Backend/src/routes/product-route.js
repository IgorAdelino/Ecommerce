const express = require('express')
const {createProduct, getAProduct, getAllProducts} = require('../controllers/product-controller')

const router = express.Router()

router.post('/', createProduct)
router.get('/list', getAllProducts)
router.get('/:id', getAProduct)

module.exports = router