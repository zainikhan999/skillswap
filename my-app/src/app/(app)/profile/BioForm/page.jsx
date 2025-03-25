"use client";
import { useState } from "react";

export default function BioForm() {

  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState([{ platform: "", url: "" }]);

  const handleBioChange = (e) => setBio(e.target.value);

  const handleSocialChange = (index, e) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][e.target.name] = e.target.value;
    setSocialLinks(updatedLinks);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const removeSocialLink = (index) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 md:p-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Bio Information
        </h2>

        {/* Bio Input */}
        <textarea
          name="bio"
          placeholder="Tell us about yourself..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px]"
          value={bio}
          onChange={handleBioChange}
        />

        {/* Social Media Links */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Social Media Links</h3>

          {socialLinks.map((link, index) => (
            <div key={index} className="flex gap-4 mb-3">
              <input
                type="text"
                name="platform"
                placeholder="Platform (e.g., LinkedIn, Twitter)"
                className="w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={link.platform}
                onChange={(e) => handleSocialChange(index, e)}
              />
              <input
                type="text"
                name="url"
                placeholder="Profile URL"
                className="w-2/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={link.url}
                onChange={(e) => handleSocialChange(index, e)}
              />
              <button
                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-all"
                onClick={() => removeSocialLink(index)}
              >
                ✖
              </button>
            </div>
          ))}

          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all mt-2"
            onClick={addSocialLink}
          >
            + Add Social Link
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-6 mt-8">
          <button 
          className="w-full md:w-1/3 bg-gray-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-400 transition-all">
            Back
          </button>
          <button className="w-full md:w-1/3 bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600 transition-all">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
