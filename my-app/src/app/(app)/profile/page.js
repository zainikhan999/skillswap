"use client";
import { FaUserCircle } from "react-icons/fa"; // Import the icon
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "contexts/AuthContext";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dnmhfubvn/image/upload";
const UPLOAD_PRESET = "displaypicture";

export default function ProfileForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    city: "",
    country: "Pakistan",
    contactNumber: "",
    bio: "",
    skills: [""],
    profileImage: "",
  });

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setFormData((prev) => ({
          ...prev,
          username: parsedUser.userName || "",
        }));
      }
    }
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!image) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      const uploadedImageUrl = response.data.secure_url;

      setImageUrl(uploadedImageUrl);
      setFormData((prev) => ({ ...prev, profileImage: uploadedImageUrl }));
      alert("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const addSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, ""] });
  };

  const removeSkill = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleSubmit = async () => {
    const filteredSkills = formData.skills.filter(
      (skill) => skill.trim() !== ""
    );

    const updatedData = {
      ...formData,
      skills: filteredSkills,
      country: "Pakistan",
    };
    console.log(updatedData);
    // Include country in the validation too
    if (
      !updatedData.name ||
      !updatedData.city ||
      !updatedData.country ||
      !updatedData.contactNumber ||
      !updatedData.bio ||
      filteredSkills.length === 0
    ) {
      alert("All fields are required, and at least one skill must be provided");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/submit-profile",
        updatedData
      );
      alert(response.data.message);
      router.push("/allservices");
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting profile");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 md:p-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Profile Information
        </h2>
        {/* Profile Picture Upload Section */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Check if imageUrl exists; if not, show the default avatar icon */}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-gray-400 w-24 h-24" /> // Display icon when no image is uploaded
            )}
          </div>

          <div className="flex flex-col items-end">
            <input type="file" onChange={handleFileChange} className="mb-2" />
            <button
              onClick={uploadImage}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Upload Picture
            </button>
          </div>
        </div>
        <input
          type="text"
          name="username"
          value={formData.username}
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-200 mb-7"
          readOnly
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
            value={formData.city}
          />
          <input
            type="text"
            name="country"
            value="Pakistan"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-200"
            readOnly
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
            value={formData.contactNumber}
          />
        </div>
        <div className="mt-6">
          <textarea
            name="bio"
            placeholder="Tell us about yourself..."
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
            value={formData.bio}
          />
        </div>
        <div className="mt-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Skills
          </label>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={skill}
                placeholder="Enter a skill"
                className="w-full p-3 border border-gray-300 rounded-lg"
                onChange={(e) => handleSkillChange(index, e.target.value)}
              />
              <button
                onClick={() => removeSkill(index)}
                style={{ backgroundColor: "#f56565", color: "white" }}
                className="px-3 py-1 rounded-full text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          <button onClick={addSkill}>+ Add Skill</button>
        </div>

        <div className="flex justify-items-end gap-6 mt-8">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Submit ➝
          </button>
        </div>
      </div>
    </div>
  );
}
