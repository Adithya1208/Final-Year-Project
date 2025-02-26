const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const { amlContract, provider } = require("../blockchain");
const { protect } = require("../middleware/auth");

// Endpoint to record a transaction on the blockchain
router.post("/record", protect, async (req, res) => {
  const {
    transactionId,
    customerId,
    customerName,
    customerAccount,
    recipientName,
    recipientAccount,
    amount,
    flagged,
    privateKey
  } = req.body;
  // For testing only: pass a private key from Ganache.
  if (!privateKey) {
    return res.status(400).json({ message: "Private key is required for signing" });
  }

  try {
    // Use the exported provider instead of amlContract.provider
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = amlContract.connect(wallet);

    const tx = await contractWithSigner.recordTransaction(
      transactionId,
      customerId,
      customerName,
      customerAccount,
      recipientName,
      recipientAccount,
      amount,
      flagged
    );
    await tx.wait();
    res.status(200).json({ message: "Transaction recorded on blockchain." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Blockchain transaction failed." });
  }
});

module.exports = router;
