"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManageCustomers() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalType, setModalType] = useState(""); // "view" or "edit"

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Admin") {
      router.push("/bank/login");
      return;
    }

    // Fetch customers
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bank/customers`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.status === 200) {
          setCustomers(data);
          setFilteredCustomers(data);
        } else {
          setError(data.message || "Failed to load customers.");
        }
      } catch (err) {
        setError("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [router, API_BASE_URL]);

  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(
      (customer) =>
        customer.customerID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleReset = () => {
    setSearchQuery("");
    setFilteredCustomers(customers);
  };

  // When clicking "Show", open modal in view mode
  const handleShow = (customer) => {
    setSelectedCustomer(customer);
    setModalType("view");
  };

  // When clicking "Edit", open modal in edit mode
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setModalType("edit");
  };

  // Update customer data via API
  const handleSaveCustomer = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/customer/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedCustomer),
      });
      const data = await response.json();
      if (response.status === 200) {
        const updated = customers.map((cust) =>
          cust.customerID === selectedCustomer.customerID ? selectedCustomer : cust
        );
        setCustomers(updated);
        setFilteredCustomers(updated);
        setSelectedCustomer(null);
      } else {
        setError(data.message || "Failed to update customer.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  // Render read-only modal for viewing details
  const renderViewModal = () => {
    if (!selectedCustomer) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">Account Details</h3>
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
              <strong>Current Balance:</strong> ₹{selectedCustomer.currentBalance || "N/A"}
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render editable modal with two columns for editing customer details, including New Password input
  const renderEditModal = () => {
    if (!selectedCustomer) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">Edit Customer Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <label className="block font-medium">Customer ID:</label>
              <input
                type="text"
                value={selectedCustomer.customerID}
                className="w-full border p-2 rounded-lg bg-gray-200 cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label className="block font-medium">Name:</label>
              <input
                type="text"
                value={selectedCustomer.name || ""}
                onChange={(e) =>
                  setSelectedCustomer({ ...selectedCustomer, name: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Date of Birth:</label>
              <input
                type="date"
                value={selectedCustomer.dob || ""}
                onChange={(e) =>
                  setSelectedCustomer({ ...selectedCustomer, dob: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Address:</label>
              <input
                type="text"
                value={selectedCustomer.address || ""}
                onChange={(e) =>
                  setSelectedCustomer({ ...selectedCustomer, address: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Contact:</label>
              <input
                type="text"
                value={selectedCustomer.contact || ""}
                onChange={(e) =>
                  setSelectedCustomer({ ...selectedCustomer, contact: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Email:</label>
              <input
                type="email"
                value={selectedCustomer.email || ""}
                onChange={(e) =>
                  setSelectedCustomer({ ...selectedCustomer, email: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Access:</label>
              <select
                value={selectedCustomer.access || ""}
                onChange={(e) =>
                  setSelectedCustomer({ ...selectedCustomer, access: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              >
                <option value="">Select Access</option>
                <option value="Granted">Granted</option>
                <option value="Denied">Denied</option>
              </select>
            </div>
            {/* New Password Input */}
            <div>
              <label className="block font-medium">New Password:</label>
              <input
                type="password"
                value={selectedCustomer.password || ""}
                onChange={(e) =>
                  setSelectedCustomer({ ...selectedCustomer, password: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                placeholder="Leave blank if unchanged"
              />
            </div>
            {/* Right Column for Account Details */}
            <div>
              <label className="block font-medium">Bank Name:</label>
              <input
                type="text"
                value={selectedCustomer.bankName || ""}
                onChange={(e) =>
                  setSelectedCustomer({ ...selectedCustomer, bankName: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Account Type:</label>
              <input
                type="text"
                value={selectedCustomer.accountType || ""}
                onChange={(e) =>
                  setSelectedCustomer({ ...selectedCustomer, accountType: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Account Number:</label>
              <input
                type="text"
                value={selectedCustomer.accountNumber || ""}
                onChange={(e) =>
                  setSelectedCustomer({ ...selectedCustomer, accountNumber: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Current Balance:</label>
              <input
                type="number"
                value={selectedCustomer.currentBalance || ""}
                onChange={(e) =>
                  setSelectedCustomer({ ...selectedCustomer, currentBalance: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              onClick={() => setSelectedCustomer(null)}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              onClick={handleSaveCustomer}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!selectedCustomer) return null;
    return modalType === "edit" ? renderEditModal() : renderViewModal();
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6 mt-24">
      {/* Header: Title on left, Search Section on right */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Customers</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded-lg"
            placeholder="Search by Customer ID or Name"
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
      {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

      {/* Customer Table */}
      <div className="overflow-x-auto w-full max-w-7xl mx-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Customer ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Date of Birth</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Contact No.</th>
              <th className="border px-4 py-2">Email ID</th>
              <th className="border px-4 py-2">Access</th>
              <th className="border px-4 py-2">Account Details</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.customerID} className="text-center">
                  <td className="border px-4 py-2">{customer.customerID}</td>
                  <td className="border px-4 py-2">{customer.name}</td>
                  <td className="border px-4 py-2">{customer.dob}</td>
                  <td className="border px-4 py-2">{customer.address}</td>
                  <td className="border px-4 py-2">{customer.contact}</td>
                  <td className="border px-4 py-2">{customer.email}</td>
                  <td className="border px-4 py-2">{customer.access}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setModalType("view");
                      }}
                    >
                      Show
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600"
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {renderModal()}
    </main>
  );
}
