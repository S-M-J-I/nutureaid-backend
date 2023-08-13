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

        const type = req.params.type
        const nurse_query_options = { approved: false, booked_nurse: req.body.uid }
        const user_query_options = { approved: false, booked_by: req.body.uid }

        const options = {
            "nurse": nurse_query_options,
            "user": user_query_options
        }

        let pending = await Appointment.find({ approved: false, rejected: false, ...options[type] }).lean()
        pending = await Promise.all(pending.map(async (item) => {
            try {
                const queryer_type = type === "nurse" ? item.booked_by : item.booked_nurse
                const responseUser = await getUserDetails(queryer_type, "none", ["is_verified", "rewards"])
                return {
                    appointment_details: item,
                    responseUser
                }
            } catch (err) {
                // handle error 
            }
        }))

        // console.log(pending)

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

        res.status(201).send({ message: "Success" })

    } catch (err) {
        res.status(500).send({ message: "Internal server error" })
    }
}


const confirmAppointmentStatus = async (req, res, next) => {
    try {

        const nurse_uid = req.body.uid
        const appointment_id = req.params.id
        const status = req.body.status // can either be "approved" / "rejected"

        const appointment = await Appointment.findOne({ _id: appointment_id })
        appointment[status] = true


        let message;

        if (status === "approved") {
            // set the appointment ongoing
            appointment.ongoing = true


            // find user and nurse
            const user = await User.findOne({ uid: appointment.booked_by, type: "user" })
            const nurse = await User.findOne({ uid: appointment.booked_nurse, type: "nurse" })


            // set user and nurse appointment ongoing and ID
            user.ongoingAppointment = true
            user.ongoingAppointmentID = appointment_id


            nurse.ongoingAppointment = true
            nurse.ongoingAppointmentID = appointment_id

            message = "Sucess! Appointment Ongoing"

            // save all objects
            await user.save()
            await nurse.save()


        } else if (status === "rejected") {
            appointment.rejected = true
            message = "Appointment Rejected"
        }

        await appointment.save()

        return res.status(200).send({ message })
    } catch (err) {
        res.status(500).send({ message: "Error" })
    }
}


const completeAppointment = async (req, res, next) => {
    try {
        const nurse_uid = req.body.uid
        const appointment_id = req.params.id

        const appointment = await Appointment.findOne({ _id: appointment_id })
        appointment.ongoing = false
        appointment.completed = true

        await appointment.save()

        return res.status(200).send({ message: "Success" })
    } catch (err) {
        res.status(500).send({ message: "Error" })
    }
}



module.exports = { getAllNurses, bookAppointment, getPendingAppointmentsForUser, confirmAppointmentStatus, completeAppointment }