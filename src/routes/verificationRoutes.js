const express = require("express")
const router = express.Router()
const admin_controllers = require("../controllers/adminControllers")


router.get("/get-all/:type", admin_controllers.getAllPendingVerifications)
router.get("/get-details/:id", admin_controllers.getVerificationDetailsOfUser)
router.get("/get-file/:id/:choice", admin_controllers.getFileByIdAndChoice)
router.post("/update/:id", admin_controllers.changeVerificationStatus)


module.exports = router