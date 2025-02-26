const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  customerID: { type: String, required: true },
  suggestions: { type: String, default: "" },
  rating: { 
    type: String, 
    required: true, 
    enum: ["Excellent", "Wonderful", "Problematic", "Unable to use"]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
