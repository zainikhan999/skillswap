"use client";
import React, { useState, useEffect } from 'react';
import CreateGig from './components/createGig'; // Or createSkill.js
import GigList from './components/gigList'; // Or skillList.js

export default function Main() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  const fetchSkills = async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear previous errors

    try {
      const response = await fetch("/api/skills");
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      } else {
        setError(`Failed to fetch skills: ${response.statusText}`); // Set error message
      }
    } catch (err) {
      setError("Error fetching skills. Please try again."); // Set generic error
      console.error("Error fetching skills:", err);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const addSkill = (newSkill) => {
    setSkills([...skills, newSkill]);
    fetchSkills();
  };

  if (loading) {
    return <div>Loading skills...</div>; // Display loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  return (
    <div>
      <h1 className='bg-red-400'>Welcome to Skill Swap</h1>
      <CreateGig addSkill={addSkill} />
      {skills.length > 0 ? (
        <GigList skills={skills} /> // Display skills if available
      ) : (
        <div>No skills available.</div> // Display message if no skills
      )}
    </div>
  );
}