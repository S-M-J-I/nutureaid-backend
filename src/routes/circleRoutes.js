const express = require('express')
const router = express.Router()
const Circle = require('../models/Circle')
const circle_controllers = require('../controllers/circleControllers')
const { checkAuth } = require('../middlewares/authMiddleware')

router.post('/create', checkAuth, circle_controllers.createCircle)
router.post('/join/:id', checkAuth, circle_controllers.joinCircle)

module.exports = router