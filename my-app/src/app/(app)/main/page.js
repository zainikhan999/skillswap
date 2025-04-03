"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [userName, setUserName] = useState(null); // Start as null to prevent rendering

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.userName) {
          localStorage.removeItem("user"); // Clean up invalid data
          router.replace("/login"); // Use router.replace for immediate redirect
        } else {
          setUserName(storedUser.userName);
        }
      } catch (error) {
        localStorage.removeItem("user");
        router.replace("/login");
      }
    }
  }, [router]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data
    router.replace("/login"); // Redirect to login page
  };

  // Don't render anything until user authentication is verified
  if (userName === null) {
    return null;
  }

  return (
    <div>
      <h1>Welcome, {userName}!</h1>
      <p>I will display profiles.</p>
      <button
  onClick={handleLogout}
  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
>
  Logout
</button>
    </div>
  );
}
