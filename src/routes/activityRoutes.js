const express = require("express")
const Activity = require("../models/Activity")
const Appointment = require("../models/Appointment")
const router = express.Router()

router.get("/get/:uid", async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.params.uid, checked: false })

        res.status(200).send(activities)
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Error" })
    }
})

router.get("/get/by/appointment/:appointment_id", async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ _id: req.params.appointment_id })

        const activities = await Activity.find({ user: appointment.booked_by, checked: false })

        res.status(200).send(activities)
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Error" })
    }
})

router.post("/add/:uid/:label", async (req, res) => {
    try {

        const act = {
            user: req.params.uid,
            checked: false,
            label: req.params.label,
        }
        console.log(act)
        const activities = new Activity(act)

        await activities.save()

        res.status(200).send({ message: "Success" })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Error" })
    }
})


router.post("/checked/:uid/:act", async (req, res) => {
    try {
        const activities = await Activity.findOne({ _id: req.params.act })

        activities.checked = true

        await activities.save()

        const acts = await Activity.findOne({ user: req.params.uid })

        res.status(200).send(acts)
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Error" })
    }
})




module.exports = router