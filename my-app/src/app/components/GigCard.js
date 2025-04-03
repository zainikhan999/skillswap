// components/GigCard.js

import React from 'react';

function GigCard({ gig }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h3>{gig.title}</h3>
      <p>{gig.description}</p>
      <p>Category: {gig.category}</p>
    </div>
  );
}

export default GigCard;