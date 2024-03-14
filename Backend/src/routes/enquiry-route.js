const express = require("express")
const { createEnquiry, updateEnquiry, fetchEnquiries, deleteEnquiry, getEnquiry } = require("../controllers/enquiry-controller")
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware")
const router = express.Router()

router.post('/', authMiddleware, isAdmin, createEnquiry)
router.put('/:id', authMiddleware, isAdmin, updateEnquiry)
router.get('/', fetchEnquiries)
router.delete('/:id', authMiddleware, isAdmin, deleteEnquiry)
router.get('/:id', getEnquiry)

module.exports = router