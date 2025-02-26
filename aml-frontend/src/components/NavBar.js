"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavBar() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  // Function to check login status and role
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
    // Redirect based on role or default to customer login
    router.push("/customer/login");
  };

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
        <div>
          {userRole === "Customer" ? (
            <>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/customer/dashboard")}>
                Dashboard
              </span>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/customer/new-transaction")}>
                New Transactions
              </span>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/customer/view-transactions")}>
                View Transactions
              </span>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/customer/feedback")}>
                Feedback
              </span>
              <span className="mr-4 cursor-pointer hover:underline text-red-400" onClick={handleLogout}>
                Logout
              </span>
            </>
          ) : userRole === "Admin" ? (
            <>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/bank/dashboard")}>
                Dashboard
              </span>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/bank/manage-customers")}>
                Manage Customers
              </span>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/bank/view-transactions")}>
                View Transactions
              </span>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/bank/suspected-list")}>
                Suspected List
              </span>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/bank/view-feedback")}>
                View Feedback
              </span>
              <span className="mr-4 cursor-pointer hover:underline text-red-400" onClick={handleLogout}>
                Logout
              </span>
            </>
          ) : userRole === "BankOfficer" ? (
            <>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/officer/dashboard")}>
                Dashboard
              </span>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/officer/view-transactions")}>
                View Transactions
              </span>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/officer/suspected-list")}>
                Suspected List
              </span>
              <span className="mr-4 cursor-pointer hover:underline text-red-400" onClick={handleLogout}>
                Logout
              </span>
            </>
          ) : (
            <>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/")}>
                Home
              </span>
              <a href="#about" className="mr-4 hover:underline">About</a>
              <a href="#contact" className="mr-4 hover:underline">Contact</a>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/customer/login")}>
                Login
              </span>
              <span className="mr-4 cursor-pointer hover:underline" onClick={() => router.push("/customer/signup")}>
                Signup
              </span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
