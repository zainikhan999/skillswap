// gigList/page.js

"use client";

import React, { useState, useEffect } from "react";
import CreateGig from "../components/createGig";
import GigList from "../components/gigList";

export default function GigListPage() {
  const [gigs, setGigs] = useState([]);

  const fetchGigs = async () => {
    try {
      const response = await fetch("/api/gigs");
      if (response.ok) {
        const data = await response.json();
        setGigs(data);
      } else {
        console.error("Failed to fetch gigs:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching gigs:", error);
    }
  };

  useEffect(() => {
    fetchGigs(); // Fetch gigs on initial load
  }, []);

  const handleAddGig = (newGig) => {
    setGigs([...gigs, newGig]);
    fetchGigs(); // Refetch gigs after adding a new one
  };

  return (
    <div>
      <CreateGig addGig={handleAddGig} />
      <GigList gigs={gigs} />
    </div>
  );
}