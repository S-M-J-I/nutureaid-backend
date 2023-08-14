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
            const user = await User.findOne({ uid: appointment.booked_by, type: "user" }).select({ ongoingAppointment: 1, ongoingAppointmentID: 1 })
            const nurse = await User.findOne({ uid: appointment.booked_nurse, type: "nurse" }).select({ ongoingAppointment: 1, ongoingAppointmentID: 1 })


            // set user and nurse appointment ongoing and ID
            user.ongoingAppointment = true
            user.ongoingAppointmentID = appointment_id


            nurse.ongoingAppointment = true
            nurse.ongoingAppointmentID = appointment_id

            message = "Sucess! Appointment Ongoing"

            await Promise.all([user.save(), nurse.save()])


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


const getAppointmentDetailsById = async (req, res, next) => {
    try {
        const appointment_id = req.params.id

        const appointment = await Appointment.findOne({ _id: appointment_id, approved: true }).lean()
        if (!appointment) {
            res.status(404).send({ message: "Invalid appointment" })
            return
        }

        const nurse_select_options = { email: 1, uid: 1, fullname: 1, gender: 1, phone: 1, address: 1, rating: 1, specialities: 1, blood_group: 1, }
        const user_select_options = { email: 1, uid: 1, fullname: 1, blood_group: 1, gender: 1, phone: 1, address: 1, }

        const [nurse, user] = await Promise.all([
            User.findOne({ uid: appointment.booked_nurse, type: "nurse" }).select(nurse_select_options),
            User.findOne({ uid: appointment.booked_by, type: "user" }).select(user_select_options)
        ])

        if (!nurse) {
            res.status(404).send({ message: "Nurse not found for this appointment" })
        }

        if (!user) {
            res.status(404).send({ message: "User not found for this appointment" })
        }


        appointment.nurseDetails = nurse.cleanUser()
        appointment.userDetails = user.cleanUser()

        delete nurse, user

        res.status(200).send(appointment)
    } catch (err) {
        res.status(500).send({ message: "Internal Error" })
    }
}



module.exports = { getAllNurses, bookAppointment, getPendingAppointmentsForUser, confirmAppointmentStatus, completeAppointment, getAppointmentDetailsById }