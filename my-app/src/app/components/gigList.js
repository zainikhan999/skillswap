"use client";
import React from 'react';

export default function GigList({ skills }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Available Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <a
            key={skill.id}
            href={`/skills/${skill.id}`} // Correct href
            rel="noopener noreferrer" // Security best practice
            className="bg-gray-200 p-6 rounded-lg shadow-md"
          >
            <strong className="font-bold block mb-2">{skill.title}</strong>
            <p className="mb-2">{skill.description}</p>
            <span className="text-sm text-gray-500">({skill.category})</span>
          </a>
        ))}
      </div>
    </div>
  );
}