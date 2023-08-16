const express = require('express')
const router = express.Router()

const user_controllers = require('../controllers/userController')

const multer = require('multer')
const uploadAvatar = multer({ dest: 'images/avatar' })
const { checkAuth } = require('../middlewares/authMiddleware')

router.post('/signup', uploadAvatar.single('avatar'), user_controllers.userSignup)
router.post('/login', uploadAvatar.single('avatar'), user_controllers.userLogin)
router.post('/set-account-detail', checkAuth, user_controllers.setAccountDetail)
router.get('/get', checkAuth, user_controllers.fetchUserDetailsApiMethod)
router.post('/logout', checkAuth, user_controllers.userLogout)

module.exports = router