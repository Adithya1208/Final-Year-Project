const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Connect to Ganache using ethers v6
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

// Load the contract ABI (adjust path if needed)
const contractJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./build/contracts/AMLContract.json"), "utf8")
);

// Replace with your deployed contract address
const contractAddress = "0x9E9dEF6ab97AE5C320939334E166d975E41D0f85";

const amlContract = new ethers.Contract(contractAddress, contractJson.abi, provider);

async function recordTestTransaction() {
  // Create a signer using a test private key from Ganache
  const testPrivateKey = "0xc74805b9c531b5e09f2e409f05a1b85c97fe3193616ebcdcb0a6665c4d581a92"; // Replace with an actual private key from Ganache
  const wallet = new ethers.Wallet(testPrivateKey, provider);
  const contractWithSigner = amlContract.connect(wallet);

  console.log("Recording a test transaction...");
  const tx = await contractWithSigner.recordTransaction(
    "TXN-1234567",     // transactionId
    "CUST-0001",      // customerId
    "John Doe",       // customerName
    "ACCT-987654",    // customerAccount
    "Alice Smith",    // recipientName
    "ACCT-123456",    // recipientAccount
    1000,             // amount
    false             // flagged status
  );
  await tx.wait();
  console.log("Transaction recorded!");
}

recordTestTransaction().catch(console.error);
