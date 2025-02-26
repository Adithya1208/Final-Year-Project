const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const User = require("../models/User"); // Added to access customer details
const { protect } = require("../middleware/auth");

/** 📌 Create a New Transaction (Customer Only) */
router.post("/", protect, async (req, res) => {
  if (req.user.role !== "Customer") {
    return res
      .status(403)
      .json({ message: "Only customers can initiate transactions." });
  }

  const { receiver, recipientName, bankName, amount } = req.body;

  if (!receiver || !recipientName || !bankName || !amount) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Fetch logged-in customer details using the imported User model
    const customer = await User.findOne({ customerID: req.user.customerID });

    if (!customer) {
      return res.status(404).json({ message: "Customer details not found." });
    }

    const transaction = new Transaction({
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      sender: req.user.customerID,
      customerName: customer.name, // Save Customer Name
      customerAccountNumber: customer.accountNumber, // Save Customer A/C No.
      receiver,
      recipientName,
      bankName,
      amount,
      status: "Pending",
      createdAt: new Date().toISOString(),
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/** 📌 Retrieve Customer Transactions */
router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "Customer") {
      return res.status(403).json({ message: "Unauthorized access." });
    }

    const transactions = await Transaction.find({
      $or: [{ sender: req.user.customerID }, { receiver: req.user.customerID }],
    }).select("-__v");

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
