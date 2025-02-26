const mongoose = require("mongoose");

const officerSchema = new mongoose.Schema({
  officerID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Officer", officerSchema);
