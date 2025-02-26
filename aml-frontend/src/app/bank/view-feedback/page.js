"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ViewFeedback() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Admin") {
      router.push("/bank/login");
      return;
    }

    // Fetch feedbacks
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bank/feedback`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.status === 200) {
          setFeedbacks(data);
        } else {
          setError(data.message || "Failed to load feedback.");
        }
      } catch (err) {
        setError("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [router, API_BASE_URL]);

  return (
    <main className="p-6 mt-24 bg-gray-100 min-h-screen">
      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Customer Feedback</h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        {/* Feedback Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Customer ID</th>
                <th className="border px-4 py-2">Suggestions</th>
                <th className="border px-4 py-2">Feedback Rating</th>
                <th className="border px-4 py-2">Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : feedbacks.length > 0 ? (
                feedbacks.map((fb) => (
                  <tr key={fb._id} className="text-center">
                    <td className="border px-4 py-2">{fb.customerID}</td>
                    <td className="border px-4 py-2">
                      {fb.suggestions || "No suggestions provided"}
                    </td>
                    <td className="border px-4 py-2">{fb.rating}</td>
                    <td className="border px-4 py-2">
                      {new Date(fb.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No feedback found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
