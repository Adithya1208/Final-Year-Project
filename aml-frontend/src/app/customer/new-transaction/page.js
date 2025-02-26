"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewTransaction() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY;
  const router = useRouter();

  const [transactionData, setTransactionData] = useState({
    transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    amount: "",
    recipientName: "",
    recipientAccount: "",
    bankName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/customer/login");
    }
  }, [router]);

  const handleChange = (e) => {
    setTransactionData({ ...transactionData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    router.push("/customer/dashboard");
  };

  // Call AI prediction service via your backend (for now, simple prediction based on amount)
  const callAIPrediction = async (txData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(txData.amount) }),
      });
      const data = await response.json();
      return data.suspicious;
    } catch (err) {
      console.error("AI prediction error:", err);
      return false;
    }
  };

  // Call blockchain endpoint to record the transaction
  const recordOnBlockchain = async (txData, isSuspicious) => {
    // For testing, use the same Ganache account's private key that worked in your testRecord.js
    // Retrieve additional customer info from localStorage
    const customerId = localStorage.getItem("customerID") || "CUSTOMER_ID";
    const customerName = localStorage.getItem("customerName") || "CUSTOMER_NAME";
    const customerAccount = localStorage.getItem("customerAccount") || "CUSTOMER_AC";
    // Also retrieve the token for the authorization header
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/blockchain/record`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transactionId: txData.transactionId,
          customerId,
          customerName,
          customerAccount,
          recipientName: txData.recipientName,
          recipientAccount: txData.recipientAccount,
          amount: Number(txData.amount),
          flagged: isSuspicious,
          privateKey: "0xc74805b9c531b5e09f2e409f05a1b85c97fe3193616ebcdcb0a6665c4d581a92",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Blockchain:", data.message);
      } else {
        console.error("Blockchain error:", data.message);
      }
    } catch (err) {
      console.error("Error recording on blockchain:", err);
    }
  };

  const handleTransfer = async () => {
    setError("");
    setLoading(true);
    const token = localStorage.getItem("token");

    if (
      !transactionData.amount ||
      !transactionData.recipientName ||
      !transactionData.recipientAccount ||
      !transactionData.bankName
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      // Save transaction in your primary database
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transactionId: transactionData.transactionId,
          amount: transactionData.amount,
          recipientName: transactionData.recipientName,
          receiver: transactionData.recipientAccount,
          bankName: transactionData.bankName,
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        // Call AI prediction to determine if transaction is suspicious
        const isSuspicious = await callAIPrediction(transactionData);
        // Record the transaction on blockchain with the predicted flagged status
        await recordOnBlockchain(transactionData, isSuspicious);
        router.push("/customer/view-transactions");
      } else {
        setError(data.message || "Transaction failed.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-primary-dark">
          Transfer Funds
        </h2>

        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block font-medium">Transaction ID:</label>
            <input
              type="text"
              value={transactionData.transactionId}
              className="w-full border p-2 rounded-lg bg-gray-200 cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label className="block font-medium">Amount:</label>
            <input
              type="number"
              name="amount"
              value={transactionData.amount}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block font-medium">Recipient Name:</label>
            <input
              type="text"
              name="recipientName"
              value={transactionData.recipientName}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              placeholder="Enter recipient name"
            />
          </div>
          <div>
            <label className="block font-medium">Recipient A/C No.:</label>
            <input
              type="text"
              name="recipientAccount"
              value={transactionData.recipientAccount}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              placeholder="Enter recipient account number"
            />
          </div>
          <div>
            <label className="block font-medium">Bank Name:</label>
            <select
              name="bankName"
              value={transactionData.bankName}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            >
              <option value="">Select Bank</option>
              <option value="HDFC Bank">HDFC Bank</option>
              <option value="Kotak Bank">Kotak Bank</option>
              <option value="ICICI Bank">ICICI Bank</option>
            </select>
          </div>
          <div className="flex justify-between mt-6">
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              onClick={handleTransfer}
              disabled={loading}
            >
              {loading ? "Processing..." : "Transfer"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
