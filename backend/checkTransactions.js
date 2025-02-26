const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Connect to Ganache
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

// Load the contract ABI (adjust path if needed)
const contractJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./build/contracts/AMLContract.json"), "utf8")
);
const contractAddress = "0x9E9dEF6ab97AE5C320939334E166d975E41D0f85"; // replace with your actual address

const amlContract = new ethers.Contract(contractAddress, contractJson.abi, provider);

async function checkTransactions() {
  const count = await amlContract.transactionCount();
  console.log("Total transactions on chain:", count.toString());
  for (let i = 1; i <= count; i++) {
    let txn = await amlContract.transactions(i);
    console.log(`Transaction ${i}:`, txn);
  }
}

checkTransactions().catch(console.error);
