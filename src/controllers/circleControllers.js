const { User } = require('../models/User')
const Circle = require("../models/Circle")

const createCircle = async (req, res, next) => {
    try {
        const circle_owner = req.body.uid
        const circle_name = req.body.circle_name
        const circle = new Circle({ circle_owner, circle_name })
        await circle.save()


        const user = await User.findOne({ uid: req.body.uid }).select({ in_circle: 1, circleId: 1 })

        if (!user) {
            res.status(404).send({ message: "Not found" })
            return
        }

        user.in_circle = true
        user.circleId = circle._id

        await user.save()

        res.status(201).send({ message: "Success" })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Error" })
    }
}


const joinCircle = async (req, res, next) => {
    try {
        const user_id = req.body.uid
        const circle_code = req.body.code

        const [circle, user] = await Promise.all([
            Circle.findOne({ circle_code }),
            User.findOne({ uid: user_id }).select({ in_circle: 1, circleId: 1 })
        ])

        if (!circle) {
            res.status(404).send({ message: "Circle doesn't exist" })
            return
        }

        if (circle.circle_code !== circle_code) {
            res.status(500).send({ message: "Circle codes don't match" })
            return
        }

        circle.circle_members.push(user_id)
        user.in_circle = true
        user.circleId = circle._id

        await Promise.all([circle.save(), user.save()])

        res.status(200).send({ message: "Success" })
    } catch (err) {
        res.status(500).send({ message: "Internal Error" })
    }
}


const getCircleById = async (req, res, next) => {
    const circle_id = req.params.id
    try {
        const circle = await Circle.findOne({ _id: circle_id }).select({ circle_members: 1, circle_code: 1 }).lean()
        const members_by_uid = circle.circle_members

        let members = [];
        if (members_by_uid.length > 0) {
            members = await Promise.all(members_by_uid.map(async (element) => {
                const user = await User.findOne({ uid: element }).select({ fullname: 1, phone: 1 }).lean()
                return {
                    id: user._id,
                    title: user.fullname,
                    number: user.phone,
                    image: "../../../public/man.png", // TODO: replace with avatar path
                }
            }))
        }

        res.status(200).send({
            circle_code: circle.circle_code,
            members
        })
    } catch (err) {
        res.status(500).send({ message: "Internal Error" })
    }
}

module.exports = { joinCircle, createCircle, getCircleById }