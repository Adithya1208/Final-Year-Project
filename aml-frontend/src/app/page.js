"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const isLoggedIn = false;

  return (
    <main className="mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative w-full h-80 overflow-hidden">
        <Image
          src="/banner.webp" // Ensure this image exists in the public folder
          alt="Anti-Money Laundering"
          width={1200}
          height={160}
          className="w-full h-full object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Secure Your Transactions
          </h1>
        </div>
      </div>

      {/* Login Cards Section */}
      {!isLoggedIn ? (
        <div className="flex flex-col items-center mt-16">
          <h2 className="text-3xl font-bold text-center mb-6">Choose Your Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <Card title="Bank" link="/bank/login" />
            <Card title="Officer" link="/officer/login" />
            <Card title="Customer" link="/customer/login" />
          </div>
        </div>
      ) : (
        <div className="text-center mt-6">
          <p className="text-lg">Welcome back!</p>
        </div>
      )}
    </main>
  );
}

function Card({ title, link }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(link)}
      className="flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white border-opacity-20 hover:border-opacity-50 text-white"
    >
      <Image
        src="/login.webp" // Ensure this matches the blue login button in the second image
        alt="Login"
        width={150}
        height={150}
        className="mb-4 rounded-full border border-white border-opacity-30 p-2"
      />
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}
