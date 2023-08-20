const express = require('express')
const router = express.Router()

const user_controllers = require('../controllers/userController')

const multer = require('multer')
const uploadAvatar = multer({
    dest: 'images/avatar',
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const uploadVerification = multer({
    dest: 'verification/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const { checkAuth } = require('../middlewares/authMiddleware')

router.post('/signup', uploadAvatar.single('avatar'), user_controllers.userSignup)
router.post('/login', uploadAvatar.single('avatar'), user_controllers.userLogin)
router.post('/set-account-detail', checkAuth, user_controllers.setAccountDetail)
router.post('/verification-send/:id', uploadVerification.single('file'), user_controllers.saveVerification)
router.get('/get', checkAuth, user_controllers.fetchUserDetailsApiMethod)
router.post('/logout', checkAuth, user_controllers.userLogout)

module.exports = router