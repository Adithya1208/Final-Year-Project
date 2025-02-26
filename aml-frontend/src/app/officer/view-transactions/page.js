"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OfficerViewTransactions() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all transactions from backend
  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/officer/login");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/bank/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setTransactions(data);
        setFilteredTransactions(data);
      } else {
        setError(data.message || "Failed to load transactions.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions based on search inputs
  const handleSearch = () => {
    let filtered = [...transactions];
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (txn) =>
          (txn.customerName && txn.customerName.toLowerCase().includes(lowerSearch)) ||
          (txn.customerID && txn.customerID.toLowerCase().includes(lowerSearch))
      );
    }
    if (searchDate) {
      filtered = filtered.filter((txn) => {
        const txnDate = new Date(txn.createdAt).toISOString().split("T")[0];
        return txnDate === searchDate;
      });
    }
    setFilteredTransactions(filtered);
  };

  const handleReset = () => {
    setSearchText("");
    setSearchDate("");
    setFilteredTransactions(transactions);
  };

  // Mark a transaction as suspected (flag it)
  const handleMarkSuspect = async (transactionId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_BASE_URL}/bank/transactions/${transactionId}/flag`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Transaction marked as suspected.");
        // Refresh the transactions list so that the status updates
        fetchTransactions();
      } else {
        alert(data.message || "Failed to mark transaction.");
      }
    } catch (err) {
      alert("Server error. Please try again.");
    }
  };

  return (
    <main className="p-6 mt-24 bg-gray-100 min-h-screen">
      {/* Header Section: Title on left, search fields/buttons on right */}
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transaction Details</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by Name or Customer ID"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Error or Loading */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-6xl mx-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Timestamp</th>
                <th className="px-4 py-2 border">Customer ID</th>
                <th className="px-4 py-2 border">Customer Name</th>
                <th className="px-4 py-2 border">Customer A/C No.</th>
                <th className="px-4 py-2 border">Recipient Name</th>
                <th className="px-4 py-2 border">Recipient A/C No.</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Mark</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.transactionId} className="text-center">
                  <td className="px-4 py-2 border">
                    {new Date(txn.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">{txn.customerID || "N/A"}</td>
                  <td className="px-4 py-2 border">{txn.customerName || "N/A"}</td>
                  <td className="px-4 py-2 border">
                    {txn.customerAccountNumber || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">{txn.recipientName || "N/A"}</td>
                  <td className="px-4 py-2 border">{txn.receiver || "N/A"}</td>
                  <td className="px-4 py-2 border">₹{txn.amount}</td>
                  <td className="px-4 py-2 border">
                    {txn.status === "Flagged" ? (
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-lg"
                        disabled
                      >
                        Suspected
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkSuspect(txn.transactionId)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                      >
                        Suspect
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-2 text-center">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
