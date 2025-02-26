"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function BankLogin() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 200) {
        if (data.role === "Admin") {
          // Store token & role in localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);

          // Notify Navbar to update
          window.dispatchEvent(new Event("storage"));

          // Redirect to Bank Dashboard
          router.push("/bank/dashboard");
        } else {
          setError("Only admins are allowed to log in.");
        }
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen pt-16 bg-gray-100">
      {/* Left Side - Image Fully Filling */}
      <div className="w-1/2 hidden lg:flex">
        <Image
          src="/bankLogin.webp" // Ensure this image exists in the public folder
          alt="Bank Login"
          width={600}
          height={400}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-4">Bank Admin Login</h2>

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Username:</label>
              <input
                type="text"
                name="username"
                required
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Enter admin username"
              />
            </div>
            <div>
              <label className="block font-medium">Password:</label>
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Enter admin password"
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
