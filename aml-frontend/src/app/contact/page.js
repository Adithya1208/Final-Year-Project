"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // For this demonstration, we'll simulate a submission delay.
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Thank you for contacting us! We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-16 min-h-screen bg-gray-100 text-gray-800">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-72 lg:h-80 overflow-hidden bg-primary-dark flex items-center justify-center">
        <Image
          src="/banner.webp" // Ensure this image exists in your public folder
          alt="Contact Us"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Contact Us
          </h1>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block font-medium mb-1">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Your email"
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block font-medium mb-1">
              Subject:
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Subject"
            />
          </div>
          <div>
            <label htmlFor="message" className="block font-medium mb-1">
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Your message..."
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-dark text-white py-2 rounded-lg hover:bg-primary-dark-hover transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Contact Information Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Our Contact Information</h2>
          <div className="space-y-2">
            <p>
              <strong>Address:</strong> 123 AML Street, Financial City, Country
            </p>
            <p>
              <strong>Email:</strong> support@amlsystem.com
            </p>
            <p>
              <strong>Phone:</strong> +1 234 567 890
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
