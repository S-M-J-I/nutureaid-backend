const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    train_id: {
        type: String
    },
    val_id: {
        type: String
    },
    amount: {
        type: String
    },
    card_type: {
        type: String
    },
    store_amount: {
        type: String
    },
    card_no: {
        type: String
    },
    bank_tran_id: {
        type: String
    },
    card_issuer: {
        type: String
    },
    card_brand: {
        type: String
    },
})

const Payment = mongoose.model("Payment", paymentSchema)

module.exports = Payment