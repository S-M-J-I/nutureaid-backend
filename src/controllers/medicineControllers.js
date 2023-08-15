const MedicineTask = require("../models/MedicineTask")

const getMedicineReminders = async (req, res, next) => {
    try {
        const given_to = req.params.id
        const tasks = await MedicineTask.find({ given_to })

        res.status(200).send(tasks)
    } catch (err) {
        res.status(500).send({ message: "Internal Error" })
    }
}

const createMedicineReminder = async (req, res, next) => {
    try {
        const medicineTask = new MedicineTask(req.body)
        delete medicineTask.uid

        await medicineTask.save()

        res.status(201).send({ message: "Success" })
    } catch (err) {
        res.status(500).send({ message: "Internal Error" })
    }
}

module.exports = {
    createMedicineReminder,
    getMedicineReminders
}