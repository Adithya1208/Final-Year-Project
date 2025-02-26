"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CustomerLogin() {
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
        // Store token & user details in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("customerID", data.customerID || "");

        // Notify all components of login event
        window.dispatchEvent(new Event("storage"));

        // Redirect to customer dashboard
        router.push("/customer/dashboard");
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
          src="/customerLogin.webp" // Ensure this image exists in the public folder
          alt="Customer Login"
          width={600}
          height={400}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-4">Customer Login</h2>

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
                placeholder="Enter your username"
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
                placeholder="Enter your password"
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

          <p className="text-center text-sm mt-4">
            Not registered yet? <a href="/customer/signup" className="text-blue-600 hover:underline">Register Here</a>
          </p>
        </div>
      </div>
    </main>
  );
}
