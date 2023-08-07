const express = require('express')
const router = express.Router()

const appointment_controller = require('../controllers/appointmentsControllers')

const { checkAuth } = require('../middlewares/authMiddleware')

router.post('/book/:id', checkAuth, appointment_controller.bookAppointment)
router.get('/get', checkAuth, appointment_controller.getAllNurses)
router.get('/pending', checkAuth, appointment_controller.getPendingAppointmentsForUser)

module.exports = router