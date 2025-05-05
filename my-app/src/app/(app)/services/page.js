"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import SuccessPopup from "../../components/successPopup"; // 👈 make sure the path is correct

export default function GigUpload() {
  const [localStr, setLocalStr] = useState(null);
  const [formData, setFormData] = useState({
    skillName: "",
    skillDescription: "",
    exchangeService: "",
    username: "",
    category: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      let parsedUser = null;
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          parsedUser = JSON.parse(storedUser);
          console.log("✅ Parsed user from localStorage:", parsedUser); // 🔍
          setLocalStr(parsedUser);
          setFormData((prevFormData) => ({
            ...prevFormData,
            username: parsedUser.userName,
          }));
        }
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(
      "📤 Sending description for classification:",
      formData.skillDescription
    ); // 🔍

    try {
      const categoryResponse = await axios.post(
        "http://localhost:5000/api/classify",
        {
          text: formData.skillDescription,
        }
      );

      const category = categoryResponse.data.category;
      console.log("✅ Classified category:", category); // 🔍

      if (!category) throw new Error("Category classification failed.");

      const gigData = {
        ...formData,
        category,
      };

      console.log("📤 Sending gig data to upload endpoint:", gigData); // 🔍

      await axios.post("http://localhost:5000/api/upload-service", gigData);

      console.log("✅ Gig uploaded successfully."); // 🔍

      setShowSuccess(true);

      setFormData({
        skillName: "",
        skillDescription: "",
        exchangeService: "",
        username: localStr ? localStr.userName : "",
        category: "",
      });
    } catch (error) {
      console.error(
        "❌ Error uploading gig:",
        error.response?.data || error.message
      ); // 🔍
      alert("Failed to upload gig.");
    }
  };

  if (!localStr) return <p>User not found. Please log in.</p>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      {showSuccess && (
        <SuccessPopup
          message="Service uploaded successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}

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
          Upload Service
        </button>
      </form>
    </div>
  );
}
