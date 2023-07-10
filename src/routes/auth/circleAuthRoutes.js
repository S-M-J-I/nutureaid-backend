const express = require('express')
const router = express.Router()
const Circle = require('../../models/Circle')

const multer = require('multer')
const uploadAvatar = multer({ dest: 'images/avatar' })

const fs = require('fs')
const path = require('path')

router.post('/create', uploadAvatar.single('avatar'), async (req, res) => {

    try {
        const circle = new Circle(req.body)
        await circle.save()
        res.status(200).send({ message: "success" })
    } catch (err) {
        res.status(500).send(err)
    }
})


router.post('/join/:id', uploadAvatar.single('avatar'), async (req, res) => {
    const circle_id = req.params.id

    try {
        const circle = await Circle.findOne({ _id: circle_id })

        if (!circle) {
            res.status(404).send({ message: "Circle doesn't exist" })
            return
        }

        const user_id = req.body.uid
        const circle_code = req.body.circle_code

        if (circle.circle_code !== circle_code) {
            res.status(500).send({ message: "Circle codes don't match" })
            return
        }

        circle.circle_members.push(user_id)

        await circle.save()

        res.status(200).send({ message: "success" })
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router