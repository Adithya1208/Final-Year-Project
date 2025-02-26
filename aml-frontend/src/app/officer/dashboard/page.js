"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OfficerDashboard() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Function to fetch customers, optionally with a search query
  const fetchCustomers = async (searchTerm = "") => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/officer/login");
      return;
    }
    try {
      let url = `${API_BASE_URL}/bank/customers`;
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setCustomers(data);
      } else {
        setError(data.message || "Failed to load customers");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = () => {
    fetchCustomers(search);
  };

  const handleReset = () => {
    setSearch("");
    fetchCustomers();
  };

  // Open modal with selected customer's account details
  const handleAccountDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  return (
    <main className="p-6 mt-24 bg-gray-100 min-h-screen">
      {/* Header: Title on Left, Search on Right */}
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customer Details</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by Name or Customer ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Display Errors or Loading */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-6xl mx-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Customer ID</th>
                <th className="px-4 py-2 border">Customer Name</th>
                <th className="px-4 py-2 border">Date of Birth</th>
                <th className="px-4 py-2 border">Address</th>
                <th className="px-4 py-2 border">Contact</th>
                <th className="px-4 py-2 border">Email ID</th>
                <th className="px-4 py-2 border">Access</th>
                <th className="px-4 py-2 border">Account Details</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customerID} className="text-center">
                  <td className="px-4 py-2 border">{customer.customerID}</td>
                  <td className="px-4 py-2 border">{customer.name}</td>
                  <td className="px-4 py-2 border">
                    {new Date(customer.dob).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">{customer.address}</td>
                  <td className="px-4 py-2 border">{customer.contact}</td>
                  <td className="px-4 py-2 border">{customer.email}</td>
                  <td className="px-4 py-2 border">{customer.access}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleAccountDetails(customer)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-2 text-center">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Account Details */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Account Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Bank Name:</strong> {selectedCustomer.bankName || "N/A"}
              </p>
              <p>
                <strong>Account Type:</strong> {selectedCustomer.accountType || "N/A"}
              </p>
              <p>
                <strong>Account Number:</strong> {selectedCustomer.accountNumber || "N/A"}
              </p>
              <p>
                <strong>Current Balance:</strong>{" "}
                {selectedCustomer.currentBalance != null
                  ? `$${selectedCustomer.currentBalance}`
                  : "N/A"}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
