const express = require('express')
const router = express.Router()

const nurse_controllers = require('../../controllers/nurse/nurseControllers')

const { checkAuth } = require('../../middlewares/authMiddleware')

router.post('/book/:id', checkAuth, nurse_controllers.bookAppointment)
router.get('/get', checkAuth, nurse_controllers.getAllNurses)

module.exports = router