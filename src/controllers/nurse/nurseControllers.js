const Appointment = require("../../models/Appointment")
const { User } = require("../../models/User")

const getAllNurses = async (req, res, next) => {
    try {
        const nurses = await User.find({ type: "nurse" })

        res.status(200).send(nurses)
    } catch (err) {
        res.status(500).send({ message: "Internal server error" })
    }
}


const bookAppointment = async (req, res, next) => {
    try {

        // TODO: implement 404 error handling
        const user = req.body.uid
        const nurse = req.params.id

        const appointment_details = req.body

        // let start = appointment_details.start_date.getTime()
        // let end = appointment_details.end_data.getTime()

        // let difference_seconds = end - start
        // let difference_hours = difference_seconds / 3600
        const difference_hours = req.body.working_hours

        const cost = difference_hours * 150 // 1 BDT per HOUR

        const appointment_body = {
            booked_by: user,
            booked_nurse: nurse,
            working_hours: difference_hours,
            cost: cost
        }


        console.log(appointment_body)

        const appointment = new Appointment(appointment_body)
        await appointment.save()


        res.status(201).send({ message: "success" })

    } catch (err) {
        res.status(500).send({ message: "Internal server error" })
    }
}


module.exports = { getAllNurses, bookAppointment }