const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const Report = require("../models/Report");
const { checkAuth } = require("../middlewares/authMiddleware");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = `reports/`; // specify the path you want to store file
    //check if file path exists or create the directory
    fs.access(dir, function (error) {
      if (error) {
        console.log("Directory does not exist.");
        return fs.mkdir(dir, (error) => cb(error, dir));
      } else {
        console.log(dir);
        return cb(null, dir);
      }
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // added Date.now() so that name will be unique
  },
});
const uploadFiles = multer({ storage: storage });

router.post(
  "/upload/:id",
  checkAuth,
  uploadFiles.single("file"),
  async (req, res, next) => {
    const file = req.file;
    console.log(req.body)
    if (!file) {
      res.status(404).send({ message: "File Not Found " });
      return;
    }
    try {
      const user_id = req.params.id;
      console.log(file);
      console.log(user_id);
      const file_ext = file.originalname.includes("pdf") ? "pdf" : "jpg"
      const file_name = file.originalname;
      const file_path = `reports/${file.filename}`;
      const report = new Report({
        file_ext,
        file_path,
        user_id,
        file_name,
      });
      await report.save();
      res.status(201).send({ message: "Success" });
    } catch (err) {
      res.status(500).send({ message: "Internal Error" });
    }
  }
);

router.get("/get", checkAuth, async (req, res, next) => {
  try {
    const reports = await Report.find({ user_id: req.body.uid }).sort({ "_id": -1 }).lean();
    // console.log(reports);
    res.status(200).send(reports);
  } catch (error) {
    res.status(500).send({ message: "Internal Error" });
  }
});

module.exports = router;
