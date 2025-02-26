"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSuspectedList() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch all transactions and filter for suspected ones (status "Flagged")
  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/bank/login");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/bank/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        // Filter only flagged transactions
        const flaggedTransactions = data.filter((txn) => txn.status === "Flagged");
        setTransactions(flaggedTransactions);
        setFilteredTransactions(flaggedTransactions);
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
          (txn.transactionId && txn.transactionId.toLowerCase().includes(lowerSearch)) ||
          (txn.sender && txn.sender.toLowerCase().includes(lowerSearch))
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

  // Show modal with transaction details
  const handleShowDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  return (
    <main className="p-6 mt-24 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Suspected List</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by Name, ID..."
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
                <th className="px-4 py-2 border">Transaction ID</th>
                <th className="px-4 py-2 border">Customer ID</th>
                <th className="px-4 py-2 border">Officer ID</th>
                <th className="px-4 py-2 border">Transaction Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.transactionId} className="text-center">
                  <td className="px-4 py-2 border">
                    {new Date(txn.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {txn.transactionId || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {txn.sender || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {txn.flaggedBy || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleShowDetails(txn)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                    >
                      Show
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center">
                    No suspected transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Transaction Details */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Timestamp:</strong>{" "}
                {new Date(selectedTransaction.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Transaction ID:</strong>{" "}
                {selectedTransaction.transactionId || "N/A"}
              </p>
              <p>
                <strong>Customer ID:</strong>{" "}
                {selectedTransaction.sender || "N/A"}
              </p>
              <p>
                <strong>Recipient Name:</strong>{" "}
                {selectedTransaction.recipientName || "N/A"}
              </p>
              <p>
                <strong>Recipient A/C No.:</strong>{" "}
                {selectedTransaction.receiver || "N/A"}
              </p>
              <p>
                <strong>Amount:</strong> $
                {selectedTransaction.amount || "N/A"}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
