"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ViewTransactions() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    date: "",
    customerID: "",
    customerName: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Admin") {
      router.push("/bank/login");
      return;
    }

    // Fetch all transactions
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bank/transactions`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.status === 200) {
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

    fetchTransactions();
  }, [router, API_BASE_URL]);

  const handleSearch = () => {
    let filtered = transactions;

    if (searchQuery.date) {
      filtered = filtered.filter((txn) =>
        txn.createdAt.startsWith(searchQuery.date)
      );
    }
    if (searchQuery.customerID) {
      filtered = filtered.filter((txn) =>
        txn.customerID
          .toLowerCase()
          .includes(searchQuery.customerID.toLowerCase())
      );
    }
    if (searchQuery.customerName) {
      filtered = filtered.filter((txn) =>
        txn.customerName
          .toLowerCase()
          .includes(searchQuery.customerName.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleReset = () => {
    setSearchQuery({ date: "", customerID: "", customerName: "" });
    setFilteredTransactions(transactions);
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6 mt-24">
      {/* Header Section: Title on left, Search Fields on right */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Transaction Details</h2>
        <div className="flex flex-wrap gap-4">
          <input
            type="date"
            value={searchQuery.date}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, date: e.target.value })
            }
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            value={searchQuery.customerID}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, customerID: e.target.value })
            }
            className="border p-2 rounded-lg"
            placeholder="Customer ID"
          />
          <input
            type="text"
            value={searchQuery.customerName}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, customerName: e.target.value })
            }
            className="border p-2 rounded-lg"
            placeholder="Customer Name"
          />
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm text-center mb-4">{error}</p>
      )}

      {/* Transaction Table */}
      <div className="overflow-x-auto w-full max-w-6xl">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Timestamp</th>
              <th className="border px-4 py-2">Customer ID</th>
              <th className="border px-4 py-2">Customer Name</th>
              <th className="border px-4 py-2">Customer A/C No.</th>
              <th className="border px-4 py-2">Recipient Name</th>
              <th className="border px-4 py-2">Recipient A/C No.</th>
              <th className="border px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn) => (
                <tr key={txn._id} className="text-center">
                  <td className="border px-4 py-2">
                    {new Date(txn.createdAt).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">{txn.sender}</td>
                  <td className="border px-4 py-2">{txn.customerName}</td>
                  <td className="border px-4 py-2">
                    {txn.customerAccountNumber}
                  </td>
                  <td className="border px-4 py-2">{txn.recipientName}</td>
                  <td className="border px-4 py-2">{txn.receiver}</td>
                  <td className="border px-4 py-2">₹{txn.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
