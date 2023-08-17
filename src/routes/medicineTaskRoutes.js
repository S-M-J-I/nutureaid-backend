const express = require('express')
const { checkAuth } = require('../middlewares/authMiddleware')
const router = express.Router()
const medicine_controller = require('../controllers/medicineControllers')

router.post('/create', checkAuth, medicine_controller.createMedicineReminder)
router.get('/get-medicines/:id', checkAuth, medicine_controller.getMedicineReminders)

module.exports = router