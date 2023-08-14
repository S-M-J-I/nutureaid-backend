const express = require('express')
const router = express.Router()

const appointment_controller = require('../controllers/appointmentsControllers')

const { checkAuth } = require('../middlewares/authMiddleware')

router.post('/book/:id', checkAuth, appointment_controller.bookAppointment)
router.post('/booking-status/:id', checkAuth, appointment_controller.confirmAppointmentStatus)
router.post('/complete-booking/:id', checkAuth, appointment_controller.completeAppointment)
router.get('/get-nurses', checkAuth, appointment_controller.getAllNurses)
router.get('/get-appointment/:id', checkAuth, appointment_controller.getAppointmentDetailsById)
router.get('/pending/:type', checkAuth, appointment_controller.getPendingAppointmentsForUser)


module.exports = router