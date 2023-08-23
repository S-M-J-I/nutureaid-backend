const express = require('express')
const router = express.Router()
const Circle = require('../models/Circle')
const circle_controllers = require('../controllers/circleControllers')
const { checkAuth } = require('../middlewares/authMiddleware')

router.get('/get-members/:id', circle_controllers.getCircleById)
router.post('/create', checkAuth, circle_controllers.createCircle)
router.post('/join', checkAuth, circle_controllers.joinCircle)

module.exports = router