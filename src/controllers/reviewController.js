const Appointment = require("../models/Appointment")
const Review = require("../models/Review")

const completeReview = async (req, res, next) => {
    try {
        const details = {
            behavior,
            timely,
            skilled,
            rating,
        } = req.body

        console.log(req.body)
        const appointment_id = req.params.id
        console.log(appointment_id)
        const nurse = await Appointment.findOne({ _id: appointment_id }).select({ booked_nurse: 1 }).lean()
        const review = new Review({
            given_to: nurse.booked_nurse,
            given_by: req.body.uid,
            ...details
        })

        await review.save()

        res.status(201).send({ message: "Success" })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Error" })
    }
}

module.exports = { completeReview }