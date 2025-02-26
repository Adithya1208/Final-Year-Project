"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BankDashboard() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [officers, setOfficers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [modalType, setModalType] = useState(""); // "view" or "edit"
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    officerID: `OFF-${Math.floor(1000 + Math.random() * 9000)}`,
    name: "",
    dob: "",
    address: "",
    contact: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "Admin") {
      router.push("/bank/login");
      return;
    }
    const fetchOfficers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bank/officers`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.status === 200) {
          setOfficers(data);
          setFilteredCustomers(data);
        } else {
          setError(data.message || "Failed to load officers.");
        }
      } catch (err) {
        setError("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOfficers();
  }, [router, API_BASE_URL]);

  const handleAddOfficer = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    if (
      !newOfficer.name ||
      !newOfficer.dob ||
      !newOfficer.address ||
      !newOfficer.contact ||
      !newOfficer.email ||
      !newOfficer.password
    ) {
      setError("All fields are required.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/bank/officers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newOfficer),
      });
      const data = await response.json();
      if (response.status === 201) {
        const updatedOfficers = [...officers, { ...newOfficer }];
        setOfficers(updatedOfficers);
        setFilteredCustomers(updatedOfficers);
        setShowAddForm(false);
        setNewOfficer({
          officerID: `OFF-${Math.floor(1000 + Math.random() * 9000)}`,
          name: "",
          dob: "",
          address: "",
          contact: "",
          email: "",
          password: ""
        });
      } else {
        setError(data.message || "Failed to add officer.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredCustomers(officers);
      return;
    }
    const filtered = officers.filter(
      (officer) =>
        officer.customerID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        officer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleReset = () => {
    setSearchQuery("");
    setFilteredCustomers(officers);
  };

  // When clicking "Show", open modal in view mode
  const handleShow = (officer) => {
    setSelectedOfficer(officer);
    setModalType("view");
  };

  // When clicking "Edit", open modal in edit mode
  const handleEdit = (officer) => {
    setSelectedOfficer(officer);
    setModalType("edit");
  };

  // Update officer details via API endpoint
  const handleSaveCustomer = async () => {
    const token = localStorage.getItem("token");
    try {
      // Using update endpoint for customers managed by admin
      const response = await fetch(`${API_BASE_URL}/customer/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedOfficer),
      });
      const data = await response.json();
      if (response.status === 200) {
        const updated = officers.map((off) =>
          off.customerID === selectedOfficer.customerID ? selectedOfficer : off
        );
        setOfficers(updated);
        setFilteredCustomers(updated);
        setSelectedOfficer(null);
      } else {
        setError(data.message || "Failed to update officer.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  // Render read-only modal for viewing details
  const renderViewModal = () => {
    if (!selectedOfficer) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">Account Details</h3>
          <div className="space-y-2">
            <p><strong>Bank Name:</strong> {selectedOfficer.bankName || "N/A"}</p>
            <p><strong>Account Type:</strong> {selectedOfficer.accountType || "N/A"}</p>
            <p><strong>Account Number:</strong> {selectedOfficer.accountNumber || "N/A"}</p>
            <p><strong>Current Balance:</strong> ₹{selectedOfficer.currentBalance || "N/A"}</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setSelectedOfficer(null)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render editable modal with two columns for editing officer details (with a new password input)
  const renderEditModal = () => {
    if (!selectedOfficer) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">Edit Officer Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <label className="block font-medium">Officer ID:</label>
              <input
                type="text"
                value={selectedOfficer.customerID}
                className="w-full border p-2 rounded-lg bg-gray-200 cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label className="block font-medium">Name:</label>
              <input
                type="text"
                value={selectedOfficer.name || ""}
                onChange={(e) =>
                  setSelectedOfficer({ ...selectedOfficer, name: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Date of Birth:</label>
              <input
                type="date"
                value={selectedOfficer.dob || ""}
                onChange={(e) =>
                  setSelectedOfficer({ ...selectedOfficer, dob: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Address:</label>
              <input
                type="text"
                value={selectedOfficer.address || ""}
                onChange={(e) =>
                  setSelectedOfficer({ ...selectedOfficer, address: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Contact:</label>
              <input
                type="text"
                value={selectedOfficer.contact || ""}
                onChange={(e) =>
                  setSelectedOfficer({ ...selectedOfficer, contact: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Email:</label>
              <input
                type="email"
                value={selectedOfficer.email || ""}
                onChange={(e) =>
                  setSelectedOfficer({ ...selectedOfficer, email: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Access:</label>
              <select
                value={selectedOfficer.access || ""}
                onChange={(e) =>
                  setSelectedOfficer({ ...selectedOfficer, access: e.target.value })
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
                value={selectedOfficer.password || ""}
                onChange={(e) =>
                  setSelectedOfficer({ ...selectedOfficer, password: e.target.value })
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
                value={selectedOfficer.bankName || ""}
                onChange={(e) =>
                  setSelectedOfficer({ ...selectedOfficer, bankName: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Account Type:</label>
              <input
                type="text"
                value={selectedOfficer.accountType || ""}
                onChange={(e) =>
                  setSelectedOfficer({ ...selectedOfficer, accountType: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Account Number:</label>
              <input
                type="text"
                value={selectedOfficer.accountNumber || ""}
                onChange={(e) =>
                  setSelectedOfficer({ ...selectedOfficer, accountNumber: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium">Current Balance:</label>
              <input
                type="number"
                value={selectedOfficer.currentBalance || ""}
                onChange={(e) =>
                  setSelectedOfficer({ ...selectedOfficer, currentBalance: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              onClick={() => setSelectedOfficer(null)}
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
    if (!selectedOfficer) return null;
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
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
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
                <td colSpan="8" className="text-center py-4">
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
