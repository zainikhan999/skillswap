'use client';
import React, { useState, useEffect } from 'react';

export default function CombinedPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/skills');
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      } else {
        setError(`Failed to fetch skills: ${response.statusText}`);
      }
    } catch (err) {
      setError('Error fetching skills. Please try again.');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  if (loading) {
    return <div>Loading skills...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="bg-red-400">Welcome to Skill Swap</h1>
      {skills.length > 0 ? (
        <div>
          {skills.map((skill) => (
            <div key={skill.id}>
              <h2>{skill.name}</h2>
              <p>{skill.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>No skills available.</div>
      )}
      <h1 className="bg-amber-600">Home</h1>
    </div>
  );
}