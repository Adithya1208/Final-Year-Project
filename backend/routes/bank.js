const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const axios = require("axios");
const User = require("../models/User");
const Feedback = require("../models/Feedback");
const Transaction = require("../models/Transaction");
const { protect } = require("../middleware/auth");

/**
 * 📌 Create a New Transaction (Customer Only)
 * This endpoint allows a customer to create a new transaction.
 * It calls the OpenAI Chat Completions endpoint to check if the transaction is suspicious.
 */
router.post("/transactions", protect, async (req, res) => {
  if (req.user.role !== "Customer") {
    return res.status(403).json({ message: "Only customers can initiate transactions." });
  }

  const { receiver, recipientName, bankName, amount } = req.body;
  if (!receiver || !recipientName || !bankName || !amount) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Fetch logged-in customer details
    const customer = await User.findOne({ customerID: req.user.customerID });
    if (!customer) {
      return res.status(404).json({ message: "Customer details not found." });
    }

    // Create a new transaction with default status "Pending"
    const transaction = new Transaction({
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      sender: req.user.customerID,
      customerName: customer.name,
      customerAccountNumber: customer.accountNumber,
      receiver,
      recipientName,
      bankName,
      amount,
      status: "Pending",
      createdAt: new Date().toISOString(),
    });

    // Save the transaction initially
    await transaction.save();

    // **Auto-Flagging via OpenAI Chat Completions**
    // Build a chat conversation where:
    // - The system instructs the assistant to decide if a transaction is suspicious.
    // - The user provides the transaction amount and asks for a "true"/"false" answer.
    const chatResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o", // Change to your desired model (e.g., "gpt-4o" or "gpt-4o-mini")
        messages: [
          {
            role: "system",
            content: "You are an assistant that evaluates transactions for anti money laundering purposes. Respond only with 'true' or 'false'.",
          },
          {
            role: "user",
            content: `Transaction amount: ${amount}. Is this transaction suspicious? Answer "true" if suspicious and "false" if not.`,
          },
        ],
        max_completion_tokens: 5,
        temperature: 0.0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Extract the answer from the chat completion response
    const result = chatResponse.data.choices[0].message.content.trim().toLowerCase();

    // If the assistant flags the transaction as suspicious, update its status to "Flagged"
    if (result === "true") {
      transaction.status = "Flagged";
      await transaction.save();
    }

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Transaction creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 📌 ADD a New Bank Officer (Admin Only)
 * This endpoint adds a new officer using the User model.
 */
router.post("/officers", protect, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Only Admins can add officers." });
  }

  const { officerID, name, dob, address, contact, email, password } = req.body;
  if (!officerID || !name || !dob || !address || !contact || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newOfficer = new User({
      customerID: officerID, // Reusing customerID field to store officerID
      name,
      dob,
      address,
      contact,
      email,
      username: email, // Using email as username
      password: hashedPassword,
      role: "BankOfficer",
    });

    await newOfficer.save();
    res.status(201).json({ message: "Officer added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

/**
 * 📌 GET All Bank Officers (Admin Only)
 * Fetch bank officers from the User model where role is "BankOfficer"
 */
router.get("/officers", protect, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Only Admins can access officers." });
  }
  try {
    const officers = await User.find({ role: "BankOfficer" }).select("-password -__v");
    res.status(200).json(officers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

/** 
 * 📌 GET All Customers (Accessible by Admin & BankOfficer)
 * Supports an optional "search" query parameter to filter by name or customerID.
 */
router.get("/customers", protect, async (req, res) => {
  if (req.user.role !== "Admin" && req.user.role !== "BankOfficer") {
    return res.status(403).json({ message: "Only Admins or Bank Officers can access this data." });
  }

  const { search } = req.query;
  const query = { role: "Customer" };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { customerID: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const customers = await User.find(query).select(
      "customerID name dob address contact email access bankName accountType accountNumber currentBalance"
    );
    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/** 📌 Update Customer Access (Admin Only) */
router.put("/customers/access", protect, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Only Admins can update customer access." });
  }

  const { customerID, access } = req.body;
  if (!customerID || !access) {
    return res.status(400).json({ message: "Customer ID and access status are required." });
  }

  try {
    const customer = await User.findOne({ customerID, role: "Customer" });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    customer.access = access;
    await customer.save();
    res.status(200).json({ message: "Customer access updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/** 📌 GET All Transactions (Admin & BankOfficer Only) */
router.get("/transactions", protect, async (req, res) => {
  if (req.user.role !== "Admin" && req.user.role !== "BankOfficer") {
    return res.status(403).json({ message: "Only Admins or Bank Officers can access this data." });
  }

  try {
    const transactions = await Transaction.find().select(
      "transactionId sender receiver recipientName bankName amount status createdAt"
    );

    // Map customer details for sender information
    const customers = await User.find({ role: "Customer" }).select("customerID name accountNumber");
    const customerMap = {};
    customers.forEach((customer) => {
      customerMap[customer.customerID] = {
        name: customer.name,
        accountNumber: customer.accountNumber,
      };
    });

    const updatedTransactions = transactions.map((txn) => ({
      ...txn._doc,
      customerName: customerMap[txn.sender]?.name || "Unknown",
      customerAccountNumber: customerMap[txn.sender]?.accountNumber || "Unknown",
    }));

    res.status(200).json(updatedTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/** 📌 Retrieve All Feedback (Admin Only) */
router.get("/feedback", protect, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Only Admins can access feedback." });
  }

  try {
    const feedbacks = await Feedback.find().select("customerID suggestions rating createdAt");
    if (!feedbacks.length) {
      return res.status(404).json({ message: "No feedback found." });
    }
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Server error. Check logs for details." });
  }
});

/**
 * 📌 Mark a Transaction as Suspected (Admin & BankOfficer Only)
 */
router.put("/transactions/:transactionId/flag", protect, async (req, res) => {
  // if (req.user.role !== "Admin" && req.user.role !== "BankOfficer") {
  //   return res.status(403).json({ message: "Not authorized." });
  // }
  const { transactionId } = req.params;
  try {
    const txn = await Transaction.findOne({ transactionId });
    if (!txn) {
      return res.status(404).json({ message: "Transaction not found." });
    }
    txn.status = "Flagged";
    await txn.save();
    res.status(200).json({ message: "Transaction marked as suspected." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

/**
 * 📌 Remove Flag from a Transaction (Unflag)
 * Sets the transaction's status to "Approved" so that it is no longer flagged.
 */
router.put("/transactions/:transactionId/unflag", protect, async (req, res) => {
  if (req.user.role !== "Admin" && req.user.role !== "BankOfficer") {
    return res.status(403).json({ message: "Not authorized." });
  }
  const { transactionId } = req.params;
  try {
    const txn = await Transaction.findOne({ transactionId });
    if (!txn) {
      return res.status(404).json({ message: "Transaction not found." });
    }
    txn.status = "Approved";
    await txn.save();
    res.status(200).json({ message: "Transaction unflagged successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
