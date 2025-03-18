
"use client";
import React, { useState } from "react";
import { redirect } from 'next/navigation';
import axios from "axios";

export default function SignUp() {
  // const router = useRouter(); //  Initialize the router

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setUserNameError("");
    setEmailError("");

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        userName,
        firstName,
        lastName,
        email,
        password,
      });

      if (response.status === 201) {
        console.log("User registered successfully:", response.data);

        const userData = { username: userName, firstName, lastName, email };
        localStorage.setItem("user", JSON.stringify(userData));

        setShowPopup(true);

        // ✅ Redirect to home page after 3 seconds
        setTimeout(() => {
          setShowPopup(false);
          redirect("/main"); // ✅ Use router.push to navigate in Next.js
        }, 3000);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        const { message } = error.response.data;

        if (message.includes("Username")) {
          setUserNameError("This username is already taken. Please choose another.");
        }
        if (message.includes("Email")) {
          setEmailError("This email is already registered. Please use a different email.");
        }
      } else {
        console.error("Error response structure:", error.response);
        setErrorMessage("Signup failed. Please try again.");
      }
    }
  };

  return (
    <>
      <h1 className="text-center text-4xl text-blue-500">Sign Up</h1>
      <div className="flex items-center justify-center h-screen bg-gray-100">
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
              {userNameError && <p className="text-orange-500 text-xs">{userNameError}</p>}
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
              {emailError && <p className="text-orange-500 text-xs">{emailError}</p>}
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
            </div>

            {errorMessage && <p className="text-orange-500 text-sm text-center">{errorMessage}</p>}

            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg text-green-600">You have successfully signed up!</p>
          </div>
        </div>
      )}
    </>
  );
}