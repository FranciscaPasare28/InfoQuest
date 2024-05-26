import React from 'react';

function Avatar({ size = 100, color = '#007bff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="512" cy="256" r="256" fill={color} />
      <path fill={color} d="M1024,1024H0C0,708.1,228.9,479.2,512,479.2S1024,708.1,1024,1024z" />
    </svg>
  );
}

export default Avatar;
