"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa"; // Importing Profile Icon from React Icons

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);


  
  useEffect(() => {
    const fetchProfile = async () => {
      let parsedUser = null;
  
      if (typeof window !== "undefined") { 
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          parsedUser = JSON.parse(storedUser);
        }
      }
  
      if (!parsedUser || !parsedUser.userName) { 
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5000/get-latest-profile`, {
          params: { username: parsedUser.userName } // Send username as a query param
        });
  
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);
  

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  if (!profile) return <div className="text-center mt-10 text-lg">No profile found</div>;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 md:p-10 text-gray-800">
        {/* Profile Icon */}
        <div className="flex flex-col items-center">
          <FaUserCircle className="h-24 w-24 text-gray-400 mb-3" /> {/* React Icon */}
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <p className="text-gray-600">{profile.city}, {profile.country}</p>
        </div>

        {/* Profile Details */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <p className="text-gray-600">📞 {profile.contactNumber}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Bio</h3>
          <p className="text-gray-600">{profile.bio}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Skills</h3>
          <ul className="list-disc pl-5 text-gray-600">
            {profile.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
