const express = require('express')
const router = express.Router()
const { User } = require('../models/User')

const multer = require('multer')
const uploadAvatar = multer({ dest: 'images/avatar' })

const fs = require('fs')
const path = require('path')

router.post('/signup', uploadAvatar.single('avatar'), async (req, res) => {

    try {
        const user = new User(req.body)
        await user.save()
        res.status(200).send({ message: "success" })
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router