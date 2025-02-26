"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerSignup() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  // Step State
  const [step, setStep] = useState(1);

  // Personal Info State
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    address: "",
    contact: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
  });

  // Account Details State
  const [accountData, setAccountData] = useState({
    bankName: "",
    accountType: "",
    accountNumber: "",
    currentBalance: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAccountChange = (e) => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!formData.name || !formData.dob || !formData.address || !formData.contact || !formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!accountData.bankName || !accountData.accountType || !accountData.accountNumber || !accountData.currentBalance) {
      setError("Please fill in all account details.");
      return;
    }
    if (accountData.accountNumber.length !== 8) {
      setError("Account Number must be exactly 8 digits.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...accountData,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccess("Registration Successful! Redirecting to Login...");
        
        setTimeout(() => {
          router.push("/customer/login");
        }, 2000);
      } else {
        setError(data.message || "Registration failed. Try again.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-center mb-6 text-primary-dark">
          {step === 1 ? "Customer Registration - Personal Details" : "Account Details"}
        </h2>

        {step === 1 && (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Name:</label>
              <input type="text" name="name" required placeholder="Full Name" onChange={handleChange} className="w-full border p-2 rounded-lg"/>
            </div>

            <div>
              <label className="block font-medium">Date of Birth:</label>
              <input type="date" name="dob" required onChange={handleChange} className="w-full border p-2 rounded-lg"/>
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium">Address:</label>
              <textarea name="address" required placeholder="Address" onChange={handleChange} className="w-full border p-2 rounded-lg"/>
            </div>

            <div>
              <label className="block font-medium">Contact No.:</label>
              <input type="number" name="contact" required placeholder="Contact No." onChange={handleChange} className="w-full border p-2 rounded-lg"/>
            </div>

            <div>
              <label className="block font-medium">Email ID:</label>
              <input type="email" name="email" required placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded-lg"/>
            </div>

            <div>
              <label className="block font-medium">Username:</label>
              <input type="text" name="username" required placeholder="Username" onChange={handleChange} className="w-full border p-2 rounded-lg"/>
            </div>

            <div>
              <label className="block font-medium">Password:</label>
              <input type="password" name="password" required placeholder="Password" onChange={handleChange} className="w-full border p-2 rounded-lg"/>
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium">Confirm Password:</label>
              <input type="password" name="confirmPassword" required placeholder="Confirm Password" onChange={handleChange} className="w-full border p-2 rounded-lg"/>
            </div>

            <button type="button" onClick={handleNext} className="w-full bg-primary-dark text-white py-2 rounded-lg hover:bg-primary-dark-hover transition md:col-span-2">
              Next
            </button>
          </form>
        )}

        {error && <p className="text-red-600 text-sm text-center mt-4 mb-4">{error}</p>}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Bank Name:</label>
              <select name="bankName" required onChange={handleAccountChange} className="w-full border p-2 rounded-lg">
                <option value="">Select Bank</option>
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="Kotak Bank">Kotak Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Account Type:</label>
              <select name="accountType" required onChange={handleAccountChange} className="w-full border p-2 rounded-lg">
                <option value="">Select Account Type</option>
                <option value="Savings Account">Savings Account</option>
                <option value="Current Account">Current Account</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Account Number:</label>
              <input type="number" name="accountNumber" required placeholder="8-digit Account Number" onChange={handleAccountChange} className="w-full border p-2 rounded-lg"/>
            </div>

            <div>
              <label className="block font-medium">Current Balance:</label>
              <input type="number" name="currentBalance" required placeholder="Current Balance" onChange={handleAccountChange} className="w-full border p-2 rounded-lg"/>
            </div>

            <button type="submit" className="w-full bg-primary-dark text-white py-2 rounded-lg hover:bg-primary-dark-hover transition md:col-span-2">
              Sign Up
            </button>
          </form>
        )}

        {success && <p className="text-green-600 text-sm text-center mt-4">{success}</p>}

        <p className="text-center text-sm mt-4">
          Already have an account? <a href="/customer/login" className="text-blue-600 hover:underline">Login Here</a>
        </p>
      </div>
    </main>
  );
}
