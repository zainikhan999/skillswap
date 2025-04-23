"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function GigUpload() {
  const [localStr, setLocalStr] = useState(null); // Start as null to prevent rendering
  const [formData, setFormData] = useState({
    skillName: "",
    skillDescription: "",
    exchangeService: "",
    username: "", // Username is now part of formData
  });

  const [loading, setLoading] = useState(true); // To manage loading state

  useEffect(() => {
    const fetchProfile = async () => {
      let parsedUser = null;

      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          parsedUser = JSON.parse(storedUser);
          setLocalStr(parsedUser); // Set the username in local state
        }
      }

      if (!parsedUser || !parsedUser.userName) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/get-latest-profile`,
          {
            params: { username: parsedUser.userName }, // Send username as a query param
          }
        );

        // Set the username in form data after fetching the profile
        setFormData((prevFormData) => ({
          ...prevFormData,
          username: parsedUser.userName, // Directly set username in formData
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Attach username to form data (already included in state after useEffect)
    const gigData = { ...formData };

    try {
      await axios.post("http://localhost:5000/api/upload-service", gigData);
      alert("Gig uploaded successfully!");
      setFormData({
        skillName: "",
        skillDescription: "",
        exchangeService: "",
        username: localStr ? localStr.userName : "", // Ensure we use the username safely
      });
    } catch (error) {
      console.error("Error uploading gig:", error);
      alert("Failed to upload gig.");
    }
  };

  // Check if localStr is available before rendering
  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!localStr) {
    return <p>User not found. Please log in.</p>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      {/* <p>User name: {localStr.userName}</p> Safely access userName */}
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Offer Your Service
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="skillName"
          placeholder="Skill Name"
          value={formData.skillName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="skillDescription"
          placeholder="Describe your skill..."
          value={formData.skillDescription}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="exchangeService"
          placeholder="What service do you want in exchange?"
          value={formData.exchangeService}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Upload Gig
        </button>
      </form>
    </div>
  );
}
