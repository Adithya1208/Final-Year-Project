const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (Customer, Bank Officer, or Admin)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - dob
 *               - address
 *               - contact
 *               - email
 *               - username
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *               contact:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Admin, BankOfficer, Customer]
 *               bankName:
 *                 type: string
 *                 enum: [HDFC Bank, Kotak Bank, ICICI Bank]
 *               accountType:
 *                 type: string
 *                 enum: [Savings Account, Current Account]
 *               accountNumber:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 8
 *               currentBalance:
 *                 type: number
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Server error.
 */
router.post('/register', async (req, res) => {
  const { name, dob, address, contact, email, username, password, role, bankName, accountType, accountNumber, currentBalance } = req.body;

  if (!name || !dob || !address || !contact || !email || !username || !password || !role) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  if (role === 'Customer' && (!bankName || !accountType || !accountNumber || !currentBalance)) {
    return res.status(400).json({ message: 'Please provide all account details.' });
  }

  if (role === 'Customer' && accountNumber.length !== 8) {
    return res.status(400).json({ message: 'Account Number must be exactly 8 digits.' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      dob,
      address,
      contact,
      email,
      username,
      password,
      role,
      bankName,
      accountType,
      accountNumber,
      currentBalance,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully', customerID: user.customerID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user and return a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 role:
 *                   type: string
 *                 customerID:
 *                   type: string
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Server error.
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      // Create token payload
      const payload = {
        id: user._id,
        username: user.username,
        role: user.role,
        customerID: user.customerID || null,
        bankName: user.bankName || null,
        accountNumber: user.accountNumber || null
      };

      // Sign token with secret and expiration
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.json({ token, role: user.role, customerID: user.customerID || null });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
