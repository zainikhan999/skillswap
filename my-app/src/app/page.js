"use client";

import React from "react";
import { FaExchangeAlt, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import Link from "next/link"; // Add this at the top with other imports

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center bg-gradient-to-r from-green-100 to-green-200">
        <h1 className="text-4xl font-bold text-gray-800 md:text-5xl">
          Welcome to SkillSwap
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          SkillSwap is a platform where you can trade your skills with others!
          Whether you're a developer looking to learn design or a writer
          interested in coding, this is the place to connect, learn, and grow.
        </p>
        <div className="mt-6">
          <Link href="/login">
            <button className="flex items-center gap-2 px-6 py-3 text-lg text-white bg-green-500 rounded-full hover:bg-green-600">
              <FaExchangeAlt /> Start Swapping
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-8 px-8 py-16 md:grid-cols-3 bg-white">
        <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-green-700">
            Find Skills
          </h2>
          <p className="text-gray-600">
            Explore a wide range of skills from users around the world. From
            coding to cooking, find exactly what you need.
          </p>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-green-700">
            Offer Your Skills
          </h2>
          <p className="text-gray-600">
            Share your expertise and teach others. It’s a great way to give back
            and get recognized.
          </p>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-green-700">
            Build Connections
          </h2>
          <p className="text-gray-600">
            Meet like-minded learners and professionals. Collaborate, network,
            and grow together.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-gray-500 bg-gray-200">
        © {new Date().getFullYear()} SkillSwap. All rights reserved.
      </footer>
    </div>
  );
}
