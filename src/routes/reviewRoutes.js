const express = require('express')
const router = express.Router()

const { checkAuth } = require('../middlewares/authMiddleware')
const reviewController = require('../controllers/reviewController')

router.post('/give/:id', checkAuth, reviewController.completeReview)


module.exports = router