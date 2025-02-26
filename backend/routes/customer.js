const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const bcrypt = require("bcrypt");

/** 📌 GET Logged-in Customer Profile */
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/** 📌 UPDATE Customer Profile (including password update) */
router.put("/update", protect, async (req, res) => {
  const { _id, name, dob, address, contact, email, username, password, bankName, accountType, accountNumber, currentBalance, access } = req.body;

  console.log("_id");
  console.log(_id);

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile fields
    user.name = name || user.name;
    user.dob = dob || user.dob;
    user.address = address || user.address;
    user.contact = contact || user.contact;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bankName = bankName || user.bankName;
    user.accountType = accountType || user.accountType;
    user.accountNumber = accountNumber || user.accountNumber;
    user.currentBalance = currentBalance || user.currentBalance;
    user.access = access || user.access;
    
    // Update password if a new non-empty password is provided.
    if (password && password.trim() !== "") {
      user.password = password;
    }

    await user.save();
    res.status(200).json({ message: "Customer details updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/** 📌 UPDATE Customer Password (Separate endpoint if needed) */
router.put("/update-password", protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    // Update the password (the pre-save hook in the model will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
