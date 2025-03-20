"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="pt-16 min-h-screen bg-gray-100 text-gray-800">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-72 lg:h-80 overflow-hidden bg-primary-dark flex items-center justify-center">
        <Image
          src="/banner.webp" // Ensure this image exists in your public folder
          alt="About AML System"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            About Our AML System
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">What is this project?</h2>
          <p className="leading-relaxed">
            This Anti-Money Laundering (AML) System is a college project designed to demonstrate how
            financial institutions can detect and prevent suspicious transactions. By monitoring
            user activity, transaction patterns, and risk indicators, the system helps ensure that
            illicit funds do not enter the banking system.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Key Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Role-Based Access:</strong> Three levels of access—Customer, Bank Officer, and
              Admin—each with distinct permissions.
            </li>
            <li>
              <strong>Transaction Monitoring:</strong> Customers can initiate transactions, which are
              then tracked and analyzed for suspicious patterns.
            </li>
            <li>
              <strong>Suspicious Activity Marking:</strong> Bank Officers can flag questionable
              transactions for further review.
            </li>
            <li>
              <strong>Feedback Mechanism:</strong> Users can submit feedback, and Admins can review
              it for system improvements.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Technologies Used</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Next.js (App Router):</strong> For the front-end user interface and routing.
            </li>
            <li>
              <strong>Express & Node.js:</strong> For the back-end API and server logic.
            </li>
            <li>
              <strong>MongoDB & Mongoose:</strong> For database storage and object data modeling.
            </li>
            <li>
              <strong>Tailwind CSS:</strong> For rapid UI styling.
            </li>
            <li>
              <strong>Bcrypt & JWT:</strong> For secure password hashing and authentication.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Sign Up or Login:</strong> Depending on your role, you can sign up as a
              Customer or log in as an Admin/Officer.
            </li>
            <li>
              <strong>Perform Transactions:</strong> Customers create transactions, which are
              recorded in the system.
            </li>
            <li>
              <strong>Monitor & Flag:</strong> Bank Officers review transaction data and flag
              suspicious activity.
            </li>
            <li>
              <strong>Admin Oversight:</strong> Admins can manage customers, review flagged
              transactions, and maintain system integrity.
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Disclaimer</h2>
          <p className="leading-relaxed">
            This project is a proof-of-concept created for educational purposes. It does not
            constitute a production-grade AML solution and should not be used for real financial
            transactions.
          </p>
        </section>

        <div className="flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary-dark-hover"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </main>
  );
}
