"use client";
import { useState } from "react";

export default function SkillsForm() {

  const [skills, setSkills] = useState([
    { id: 1, name: "", experience: "", expertise: "Beginner", description: "" },
  ]);

  const handleChange = (id, field, value) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  const addSkill = () => {
    setSkills([
      ...skills,
      {
        id: Date.now(),
        name: "",
        experience: "",
        expertise: "Beginner",
        description: "",
      },
    ]);
  };

  const removeSkill = (id) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 md:p-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Skills Information
        </h2>

        {/* Dynamic Skills Fields */}
        <div className="space-y-6">
          {skills.map((skill) => (
            <div key={skill.id} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Skill Name */}
              <input
                type="text"
                placeholder="Skill Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={skill.name}
                onChange={(e) => handleChange(skill.id, "name", e.target.value)}
              />

              {/* Experience */}
              <input
                type="text"
                placeholder="Experience (years)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={skill.experience}
                onChange={(e) =>
                  handleChange(skill.id, "experience", e.target.value)
                }
              />

              {/* Expertise Level */}
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={skill.expertise}
                onChange={(e) =>
                  handleChange(skill.id, "expertise", e.target.value)
                }
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Expert</option>
              </select>

              {/* Skill Description */}
              <textarea
                placeholder="Describe your skill (e.g., projects, proficiency, tools used)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-24 md:col-span-3"
                value={skill.description}
                onChange={(e) =>
                  handleChange(skill.id, "description", e.target.value)
                }
              />

              {/* Remove Skill Button */}
              {skills.length > 1 && (
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="md:col-span-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                >
                  ✖ Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Skill Button */}
          <button
            onClick={addSkill}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all mt-2"

          >
            + Add Skill
          </button>

        {/* Navigation Buttons */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
          <button 
           
          className="w-full md:w-1/3 bg-gray-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-400 transition-all">
            Back
          </button>
          <button className="w-full md:w-1/3 bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600 transition-all">
            Next ➝
          </button>
        </div>
      </div>
    </div>
  );
}
