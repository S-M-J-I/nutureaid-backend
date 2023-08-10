const Appointment = require("../models/Appointment")
const { User } = require("../models/User")
const { getUserDetails } = require("./userController")

const getAllNurses = async (req, res, next) => {
    try {
        const nurses = await User.find({ type: "nurse" })

        res.status(200).send(nurses)
    } catch (err) {
        res.status(500).send({ message: "Internal server error" })
    }
}


const getPendingAppointmentsForUser = async (req, res, next) => {
    try {

        let pending = await Appointment.find({ approved: false, booked_by: req.body.uid })
        pending = await Promise.all(pending.map(async (item, index) => {
            try {
                const booked_nurse = item.booked_nurse
                const nurse = await getUserDetails(booked_nurse, "nurse", ["is_verified", "rewards"])
                item.booked_nurse = nurse
                return item
            } catch (err) {
                // handle error 
            }
        }))


        res.status(200).send(pending)
    } catch (err) {
        res.status(500).send({ message: "Internal server error" })
    }
}


const bookAppointment = async (req, res, next) => {
    try {

        // TODO: implement 404 error handling
        const user = req.body.uid
        const nurse = req.params.id

        const appointment_details = {
            ...req.body,
            booked_nurse: nurse
        }

        delete appointment_details.uid

        console.log(appointment_details)

        const appointment = new Appointment(appointment_details)
        await appointment.save()

        res.status(201).send({ message: "success" })

    } catch (err) {
        res.status(500).send({ message: "Internal server error" })
    }
}


module.exports = { getAllNurses, bookAppointment, getPendingAppointmentsForUser }