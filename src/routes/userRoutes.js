const express = require('express')
const router = express.Router()
const user_controllers = require('../controllers/userController')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const verificationStore = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = `verification/`; // specify the path you want to store file
        //check if file path exists or create the directory
        fs.access(dir, function (error) {
            if (error) {
                return fs.mkdir(dir, (error) => cb(error, dir));
            } else {
                return cb(null, dir);
            }
        });
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // added Date.now() so that name will be unique
    },
})
const avatarStore = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = `images/avatar/`; // specify the path you want to store file
        //check if file path exists or create the directory
        fs.access(dir, function (error) {
            if (error) {
                return fs.mkdir(dir, (error) => cb(error, dir));
            } else {
                return cb(null, dir);
            }
        });
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // added Date.now() so that name will be unique
    },
})


const uploadAvatar = multer({
    storage: avatarStore,
    limits: { fieldSize: 2 * 1024 * 1024 }
})
const uploadVerification = multer({
    storage: verificationStore,
    limits: {
        fieldSize: 10 * 1024 * 1024,
        files: 3
    }
})
const { checkAuth } = require('../middlewares/authMiddleware')

router.post('/signup', uploadAvatar.single('avatar'), user_controllers.userSignup)
router.post('/login', uploadAvatar.single('avatar'), user_controllers.userLogin)

router.post('/upload-avatar/:id', uploadAvatar.single('avatar'), user_controllers.uploadAvatar)

router.post('/set-account-detail', checkAuth, user_controllers.setAccountDetail)
router.post('/verification-send/:id', uploadVerification.array('files', 3), user_controllers.saveVerification)

router.post('/set-health-issue/:id', user_controllers.setHealthIssue)
router.post('/set-health-log/:id', user_controllers.setHealthLog)

router.get('/get/:id', user_controllers.fetchUserDetailsApiMethod)

router.post('/logout', checkAuth, user_controllers.userLogout)

module.exports = router