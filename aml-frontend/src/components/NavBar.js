"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavBar() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Check login status and role from localStorage
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setUserRole(token ? role : null);
  };

  useEffect(() => {
    checkLoginStatus(); // Check login status on mount

    // Listen for login/logout events across tabs
    const handleStorageChange = () => checkLoginStatus();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    checkLoginStatus(); // Update state immediately
    window.dispatchEvent(new Event("storage")); // Notify all tabs
    router.push("/customer/login");
  };

  // Toggle dropdown on profile icon click
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Hide dropdown if user clicks outside or navigates
  // (Optional) You can add a click handler on document to hide it

  return (
    <nav className="bg-primary-dark text-white h-16 fixed top-0 left-0 w-full flex items-center px-6 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Clickable Logo that navigates to Home */}
        <div
          className="text-xl font-bold cursor-pointer hover:underline"
          onClick={() => router.push("/")}
        >
          Anti-Money Laundering System
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {userRole === "Customer" && (
            <>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/customer/dashboard")}
              >
                Dashboard
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/customer/new-transaction")}
              >
                New Transactions
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/customer/view-transactions")}
              >
                View Transactions
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/customer/feedback")}
              >
                Feedback
              </span>
            </>
          )}

          {userRole === "Admin" && (
            <>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/bank/dashboard")}
              >
                Dashboard
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/bank/manage-customers")}
              >
                Manage Customers
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/bank/view-transactions")}
              >
                View Transactions
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/bank/suspected-list")}
              >
                Suspected List
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/bank/view-feedback")}
              >
                View Feedback
              </span>
            </>
          )}

          {userRole === "BankOfficer" && (
            <>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/officer/dashboard")}
              >
                Dashboard
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/officer/view-transactions")}
              >
                View Transactions
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/officer/suspected-list")}
              >
                Suspected List
              </span>
            </>
          )}

          {/* If no user is logged in, show public links */}
          {!userRole && (
            <>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/")}
              >
                Home
              </span>
              <a href="/about" className="hover:underline">
                About
              </a>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/customer/login")}
              >
                Login
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/customer/signup")}
              >
                Signup
              </span>
            </>
          )}

          {/* Profile Icon + Dropdown (only if user is logged in) */}
          {userRole && (
            <div className="relative">
              <img
                src="/avatar.png" // Or a dynamic URL if you store user’s profileIcon
                alt="Profile Icon"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black border border-gray-200 rounded shadow-md z-50">
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
