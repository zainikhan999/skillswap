// "use client";
// import { useState } from "react";

// export default function ProfileForm() {

//   const handleChange = (e) => {
//     console.log(e.target.value);
//   };

  

//   return (
//     <div className="w-full flex justify-center">
//       <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 md:p-10">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
//           Profile Information
//         </h2>

//         {/* Input Fields */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             onChange={handleChange}
//             defaultValue=""
//           />

//           <input
//             type="text"
//             name="city"
//             placeholder="City"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             onChange={handleChange}
//             defaultValue=""
//           />

//           <input
//             type="text"
//             name="country"
//             placeholder="Country"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             onChange={handleChange}
//             defaultValue=""
//           />

//           <input
//             type="text"
//             name="contactNumber"
//             placeholder="Contact Number"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             onChange={handleChange}
//             defaultValue=""
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-items-end  gap-6 mt-8">
         
//           <button 
//             className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all mt-2"
//             >
//             Next ➝
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client"
import { useState,useEffect } from "react";
import axios from "axios";

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    name: "",
    username: "", // Initially empty
    city: "",
    contactNumber: "",
    bio: "",
    skills: [""], 
  });
  useEffect(() => {
    if (typeof window !== "undefined") { // Ensure it's running on the client
      const storedUser = localStorage.getItem("user"); 
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setFormData((prev) => ({ ...prev, username: parsedUser.userName || "" }));
      }
    }
  }, []);

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
    try {
      const response = await axios.post("http://localhost:5000/submit-profile", formData);
      alert(response.data.message);
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

        {/* Username Field (Auto-Filled) */}
      <input
        type="text"
        name="username"
        value={formData.username}
        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-200"
        readOnly
      />

        {/* Input Fields */}
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

        {/* Bio Field */}
        <div className="mt-6">
          <textarea
            name="bio"
            placeholder="Tell us about yourself..."
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
            value={formData.bio}
          />
        </div>

        {/* Skills Section */}
        <div className="mt-6">
          <label className="block text-gray-700 font-semibold mb-2">Skills</label>
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
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
              >
                ✕
              </button>
            </div>
          ))}
          <button onClick={addSkill} className="bg-blue-500 text-white px-3 py-1 rounded-lg">
            + Add Skill
          </button>
        </div>

        {/* Submit Button */}
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
