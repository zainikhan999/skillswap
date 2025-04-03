'use client';
import React, { useState, useEffect } from 'react';
import CreateGig from './components/createGig';
import GigList from './components/gigList';

export default function CombinedPage() { // Renamed for clarity
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postError, setPostError] = useState(null);

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

  const addSkill = (newSkill) => {
    setSkills([...skills, newSkill]);
    fetchSkills();
  };

  const handleClick = async () => {
    setPostError(null);
    let data = { name: 'John', age: 25 };
    try {
      const response = await fetch('/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
      } else {
        setPostError(`Failed to post data: ${response.statusText}`);
      }
    } catch (err) {
      setPostError('Error posting data. Please try again.');
      console.error('Error in handleClick', err);
    }
  };

  if (loading) {
    return <div>Loading skills...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="bg-red-400">Welcome to Skill Swap</h1>
      <CreateGig addSkill={addSkill} />
      {skills.length > 0 ? (
        <GigList skills={skills} />
      ) : (
        <div>No skills available.</div>
      )}

      <h1 className="bg-amber-600">Home</h1>
      <button onClick={handleClick}>Click ME</button>
      {postError && <div style={{ color: 'red' }}>{postError}</div>}
    </div>
  );
}