"use client";
import React, { useState } from "react";
import CreateGig from "./createGig";
import GigList from "./gigList";

export default function Main() {
    const [gigs, setGigs] = useState([]);

    // Function to add a new gig
    const addGig = (newGig) => {
        setGigs([...gigs, newGig]);
    };

    return (
        <div className="p-4">
            <h1 className="bg-red-400 text-white text-center p-4 text-2xl font-bold">
                Welcome to Skill Swap
            </h1>
            <CreateGig addGig={addGig} />
            <GigList gigs={gigs} />
        </div>
    );
}
