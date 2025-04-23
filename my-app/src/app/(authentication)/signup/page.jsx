"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
export default function SignUp() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Redirect user if already logged in
  useEffect(() => {
    // Store only the username in localStorage
    const userData = { userName };
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Clear any general error messages

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        userName,
        firstName,
        lastName,
        email,
        password,
      });

      if (response.status === 201) {
        console.log("User registered successfully:", response.data);
        const userData = { userName, firstName, lastName, email };
        localStorage.setItem("user", JSON.stringify(userData));
        setShowPopup(true);

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          setShowPopup(false);
          router.push("/main");
        }, 3000);
      }
    } catch (error) {
      console.log("Error response:", error.response?.data);

      const data = error.response?.data;

      // Check if it's a message object
      if (data && typeof data === "object" && "message" in data) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage("Signup failed. Please try again.");
      }
    }
  };

  // Error message state for multiple fields
  const [errorMessages, setErrorMessages] = useState({});

  return (
    <>
      <h1 className="text-center text-4xl text-blue-500 mt-12">Sign Up</h1>

      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md w-full p-8 border border-gray-300 rounded-lg shadow-lg bg-white">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Welcome User!
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-800 mb-2">User Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errorMessages.userName && (
                <p className="text-orange-500 text-xs">
                  {errorMessages.userName}
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-gray-800 mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-800 mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-800 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errorMessages.email && (
                <p className="text-orange-500 text-xs">{errorMessages.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-800 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errorMessages.password && (
                <p className="text-orange-500 text-xs">
                  {errorMessages.password}
                </p>
              )}
            </div>

            {errorMessage && (
              <p className="text-orange-500 text-sm text-center">
                {errorMessage}
              </p>
            )}

            <button type="submit">Sign Up</button>
            <p className="text-center">
              Already have an account?{" "}
              <Link href="/login">
                <span className="text-blue-500 cursor-pointer">Login</span>
              </Link>
            </p>
          </form>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg text-green-600">
              You have successfully signed up!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
