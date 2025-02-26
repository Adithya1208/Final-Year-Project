"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [customerData, setCustomerData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/customer/login");
      return;
    }

    // Fetch customer details from backend
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/customer/profile`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.status === 200) {
          setCustomerData(data);
          setUpdatedData({ ...data, password: "" }); // Set password as empty for security
        } else {
          setError(data.message || "Failed to load data.");
        }
      } catch (err) {
        setError("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/customer/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      if (response.status === 200) {
        setCustomerData(updatedData);
        setEditMode(false);
      } else {
        setError(data.message || "Failed to update data.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">Customer Dashboard</h2>

      {/* Cards Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Personal Details Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Customer ID:</label>
              <input
                type="text"
                name="customerID"
                value={customerData.customerID}
                className="w-full border p-2 rounded-lg bg-gray-200 cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label className="block font-medium">Name:</label>
              <input
                type="text"
                name="name"
                value={updatedData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                disabled={!editMode}
              />
            </div>
            <div>
              <label className="block font-medium">Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={updatedData.dob.split("T")[0]}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                disabled={!editMode}
              />
            </div>
            <div>
              <label className="block font-medium">Address:</label>
              <input
                type="text"
                name="address"
                value={updatedData.address}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                disabled={!editMode}
              />
            </div>
            <div>
              <label className="block font-medium">Contact:</label>
              <input
                type="text"
                name="contact"
                value={updatedData.contact}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                disabled={!editMode}
              />
            </div>
            <div>
              <label className="block font-medium">Email:</label>
              <input
                type="email"
                name="email"
                value={customerData.email}
                className="w-full border p-2 rounded-lg bg-gray-200 cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label className="block font-medium">Username:</label>
              <input
                type="text"
                name="username"
                value={updatedData.username}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                disabled={!editMode}
              />
            </div>
            <div>
              <label className="block font-medium">Password:</label>
              <input
                type="password"
                name="password"
                value={updatedData.password}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                disabled={!editMode}
              />
            </div>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Account Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Bank Name:</label>
              <input
                type="text"
                name="bankName"
                value={updatedData.bankName}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                disabled={!editMode}
              />
            </div>
            <div>
              <label className="block font-medium">Account Type:</label>
              <input
                type="text"
                name="accountType"
                value={updatedData.accountType}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                disabled={!editMode}
              />
            </div>
            <div>
              <label className="block font-medium">Account Number:</label>
              <input
                type="text"
                name="accountNumber"
                value={updatedData.accountNumber}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                disabled={!editMode}
              />
            </div>
            <div>
              <label className="block font-medium">Current Balance:</label>
              <input
                type="number"
                name="currentBalance"
                value={updatedData.currentBalance}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                disabled={!editMode}
              />
            </div>
          </div>
        </div>
      </div>

      {editMode ? (
        <button className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600" onClick={handleSave}>
          Save
        </button>
      ) : (
        <button className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600" onClick={handleEdit}>
          Edit
        </button>
      )}
    </main>
  );
}
