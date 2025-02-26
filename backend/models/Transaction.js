const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  sender: { type: String, required: true }, // Customer ID of sender
  customerName: { type: String, required: true }, // Sender's Name
  customerAccountNumber: { type: String, required: true }, // Sender's Account Number
  receiver: { type: String, required: true }, // Receiver's Account Number
  recipientName: { type: String, required: true }, // Receiver's Name
  bankName: { type: String, required: true }, // Receiver's Bank Name
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Flagged"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
