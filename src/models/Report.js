const mongoose = require("mongoose");
const reportsSchema = mongoose.Schema({
  user_id: { type: String },
  file_name: { type: String },
  file_path: { type: String },
  file_ext: { type: String },
});

const Report = mongoose.model("Report", reportsSchema);
module.exports = Report;
