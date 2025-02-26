const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Connect to Ganache using ethers v6 syntax
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

// Load the contract ABI from Truffle's build output
const contractJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./build/contracts/AMLContract.json"), "utf8")
);

// Replace with your deployed contract address from Truffle
const contractAddress = "0x9E9dEF6ab97AE5C320939334E166d975E41D0f85";

const amlContract = new ethers.Contract(contractAddress, contractJson.abi, provider);

module.exports = { amlContract, provider };
