"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ViewTransactions() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/customer/login");
      return;
    }

    // Fetch transactions
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        const data = await response.json();
        console.log("Transactions:", data); // Debugging

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

  // Handle date filtering
  const handleSearch = () => {
    if (!selectedDate) {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter((txn) =>
        txn.createdAt && txn.createdAt.startsWith(selectedDate)
      );
      setFilteredTransactions(filtered);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6 mt-24">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Transactions</h2>
        <div className="flex gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 rounded-lg"
          />
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

      {/* Loading Message */}
      {loading ? (
        <p className="text-center mt-10">Loading transactions...</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">S. No.</th>
                <th className="border px-4 py-2">Timestamp</th>
                <th className="border px-4 py-2">Recipient Name</th>
                <th className="border px-4 py-2">Recipient A/C No.</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Bank Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn, index) => (
                  <tr key={txn._id} className="text-center">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">
                      {txn.createdAt ? new Date(txn.createdAt).toLocaleString() : "N/A"}
                    </td>
                    <td className="border px-4 py-2">
                      {txn.recipientName ? txn.recipientName : "N/A"}
                    </td>
                    <td className="border px-4 py-2">{txn.receiver}</td>
                    <td className="border px-4 py-2">₹{txn.amount}</td>
                    <td className="border px-4 py-2">
                      {txn.bankName ? txn.bankName : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
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
