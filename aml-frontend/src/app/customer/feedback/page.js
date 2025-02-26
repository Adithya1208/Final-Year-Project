"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerFeedback() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [feedbackData, setFeedbackData] = useState({
    customerID: "",
    suggestions: "",
    rating: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/customer/login");
      return;
    }

    // Fetch Customer ID from API
    const fetchCustomerID = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/customer/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.status === 200) {
          setFeedbackData((prev) => ({ ...prev, customerID: data.customerID }));
        } else {
          setError(data.message || "Failed to load customer ID.");
        }
      } catch (err) {
        setError("Server error. Please try again.");
      }
    };

    fetchCustomerID();
  }, []);

  const handleChange = (e) => {
    setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    router.push("/customer/dashboard");
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!feedbackData.rating) {
      setError("Rating is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData),
      });

      const data = await response.json();
      if (response.status === 201) {
        router.push("/customer/dashboard"); // Redirect after submission
      } else {
        setError(data.message || "Failed to submit feedback.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-primary-dark">
          Submit Feedback
        </h2>

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

        {/* Feedback Form */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Customer ID:</label>
            <input
              type="text"
              value={feedbackData.customerID}
              className="w-full border p-2 rounded-lg bg-gray-200 cursor-not-allowed"
              readOnly
            />
          </div>

          <div>
            <label className="block font-medium">Any Suggestions (Optional):</label>
            <textarea
              name="suggestions"
              value={feedbackData.suggestions}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              placeholder="Write your suggestions..."
            />
          </div>

          <div>
            <label className="block font-medium">Rating:</label>
            <select
              name="rating"
              value={feedbackData.rating}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            >
              <option value="">Select Rating</option>
              <option value="Excellent">Excellent</option>
              <option value="Wonderful">Wonderful</option>
              <option value="Problematic">Problematic</option>
              <option value="Unable to use">Unable to use</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
