const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  customerID: { type: String, unique: true, default: null }, // Only for Customers
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "BankOfficer", "Customer"], required: true },

  // Customer-Specific Fields
  bankName: {
    type: String,
    default: null,
    required: function () { return this.role === "Customer"; }
  },
  accountType: {
    type: String,
    default: null,
    required: function () { return this.role === "Customer"; }
  },
  accountNumber: {
    type: String,
    default: null,
    required: function () { return this.role === "Customer"; },
    minlength: 8,
    maxlength: 8
  },
  currentBalance: {
    type: Number,
    default: null,
    required: function () { return this.role === "Customer"; }
  },
  access: {
    type: String,
    enum: ["Granted", "Denied", "Pending"],
    default: "Pending"
  },

  // New field for user profile icon
  // Assuming "avatar.png" is in your "public" folder (e.g., "backend/public/avatar.png")
  // If your public path differs, adjust the default accordingly.
  profileIcon: {
    type: String,
    default: "/avatar.png"
  },
});

// Auto-generate customer ID before saving
userSchema.pre("save", async function (next) {
  if (this.role === "Customer" && !this.customerID) {
    this.customerID = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  next();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
