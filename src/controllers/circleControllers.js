import { User } from "../models/User"

const Circle = require("../models/Circle")

export const createCircle = async (req, res, next) => {
    try {
        const circle = new Circle(req.body)
        await circle.save()


        const [created_circle, user] = await Promise.all([
            Circle.findOne({ circle_owner: req.body.uid }).select({ _id: 1 }),
            User.findOne({ uid: req.body.uid }).select({ in_circle: 1, circleId: 1 })
        ])

        user.in_circle = true
        user.circleId = created_circle._id

        await user.save()

        res.status(200).send({ message: "Success" })
    } catch (err) {
        res.status(500).send({ message: "Internal Error" })
    }
}


export const joinCircle = async (req, res, next) => {
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
}