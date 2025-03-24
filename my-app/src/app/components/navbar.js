"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <span className="text-2xl font-bold text-[#3498DB] cursor-pointer">
              Skill Swap
            </span>
          </Link>

          {/* Buttons */}
          <div className="hidden md:flex space-x-4">
            <Link href="/login">
              <button className="px-4 py-2 border border-[#3498DB] text-[#3498DB] rounded-lg hover:bg-[#EBF5FB] transition duration-300">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-4 py-2 bg-[#E74C3C] text-white rounded-lg hover:bg-[#C0392B] transition duration-300">
                Sign Up
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#2C3E50] focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <Link href="/" className="block px-4 py-2 text-[#2C3E50] hover:bg-[#F7F9F9]">
            Home
          </Link>
          <Link href="/login" className="block px-4 py-2 text-[#2C3E50] hover:bg-[#F7F9F9]">
            Login
          </Link>
          <Link href="/signup" className="block px-4 py-2 text-white bg-[#E74C3C] text-center hover:bg-[#C0392B]">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
