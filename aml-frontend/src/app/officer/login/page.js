"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function OfficerLogin() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Check if the logged-in user is a BankOfficer
        if (data.role !== "BankOfficer") {
          setError("Not authorized to access the officer portal.");
        } else {
          // Save token and role to localStorage for subsequent requests
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          // Dispatch a storage event to notify NavBar to update
          window.dispatchEvent(new Event("storage"));
          // Redirect to officer dashboard
          router.push("/officer/dashboard");
        }
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <main className="flex h-screen pt-16 bg-gray-100">
      {/* Left Side - Image Fully Filling */}
      <div className="w-1/2 hidden lg:flex">
        <Image
          src="/officerLogin.webp" // Ensure this image exists in the public folder
          alt="Officer Login"
          width={600}
          height={400}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Right Side - Login Form Filling Remaining Height */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-4">Officer Login</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-medium">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-dark text-white py-2 rounded-lg hover:bg-primary-dark-hover"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
