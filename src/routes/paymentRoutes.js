const express = require('express')
const router = express.Router()

const SSLCommerzPayment = require('sslcommerz-lts')
const { checkAuth } = require('../middlewares/authMiddleware')
const Appointment = require('../models/Appointment')
const { User } = require('../models/User')
const Payment = require('../models/Payment')
const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASS
const is_live = false


router.post('/success/:id', async (req, res, next) => {
    try {

        const paymentBody = {
            train_id,
            val_id,
            amount,
            card_type,
            store_amount,
            card_no,
            bank_tran_id,
            card_issuer,
            card_brand
        } = req.body

        const payment = new Payment({
            ...paymentBody
        })

        const appointment_id = req.params.id

        const appointment = await Appointment.findOne({ _id: appointment_id }).select({ booked_by: 1, booked_to: 1, completed: 1 })

        const [user, nurse] = await Promise.all([
            await User.findOne({ uid: appointment.booked_by, type: "user" }).select({ ongoingAppointmentID: 1, ongoingAppointment: 1, ongoingAppointmentStatus: 1 }),
            await User.findOne({ uid: appointment.booked_to, type: "nurse" }).select({ ongoingAppointmentID: 1, ongoingAppointment: 1, ongoingAppointmentStatus: 1 })
        ])


        payment.payed_by = appointment.booked_by
        payment.payed_to = appointment.booked_to

        user.ongoingAppointmentID = "none"
        user.ongoingAppointment = false
        user.ongoingAppointmentStatus = "none"

        nurse.ongoingAppointmentID = "none"
        nurse.ongoingAppointment = false
        nurse.ongoingAppointmentStatus = "none"

        appointment.completed = true

        await Promise.all([payment.save(), appointment.save(), user.save(), nurse.save()])

        res.status(200).send("Payed! Return to App")
    } catch (err) {
        res.status(200).send({ message: "Internal Error" })
    }
})



//sslcommerz init
router.get('/init', checkAuth, async (req, res) => {
    try {

        const user = await User.findOne({ uid: req.body.uid }).select({ ongoingAppointmentID: 1, fullname: 1, email: 1, phone: 1 }).lean()

        if (!user) {
            res.status(404).send({ message: "User not found" })
            return
        }


        const appointment = await Appointment.findOne({ _id: user.ongoingAppointmentID })
        if (!appointment) {
            res.status(404).send({ message: "Appointment not found" })
            return
        }

        const data = {
            total_amount: appointment.cost,
            currency: 'BDT',
            tran_id: `${appointment._id}`, // use unique tran_id for each api call
            success_url: `http://${process.env.LOCALHOST}:3000/api/auth/payment/success/${appointment._id}`,
            fail_url: `http://${process.env.LOCALHOST}:3000/api/auth/payment/fail`,
            cancel_url: `http://${process.env.LOCALHOST}:3000/api/auth/payment/cancel`,
            ipn_url: `http://${process.env.LOCALHOST}:3000/api/auth/payment/ipn`,
            shipping_method: 'Courier',
            product_name: 'Appointment.',
            product_category: 'Service',
            product_profile: 'general',
            cus_name: user.fullname,
            cus_email: user.email,
            cus_add1: 'Dhaka',
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: user.phone,
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)

        sslcz.init(data).then(apiResponse => {
            // Redirect the user to payment gateway
            // console.log(apiResponse)
            let GatewayPageURL = apiResponse.GatewayPageURL
            res.status(200).send({ url: GatewayPageURL })
            console.log('Redirecting to: ', GatewayPageURL)
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal Error" })
    }

})




module.exports = router