
import React from 'react';

const Logo = () => {
  return (
    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center relative overflow-hidden">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        {/* Farmer figure */}
        <circle cx="8" cy="6" r="2" fill="currentColor" />
        <path d="M6 10h4v6h-2v4h-2v-4H4v-6z" fill="currentColor" />
        
        {/* Crop/wheat stalks */}
        <path 
          d="M14 4v3l1-1v2l1-1v2l1-1v3c0 1-1 2-2 2h-1v6h2v-4c1 0 2-1 2-2V8l1 1V7l-1 1V6l1 1V5l-1 1V4h-3z" 
          fill="currentColor" 
        />
        <circle cx="16" cy="3" r="0.5" fill="currentColor" />
        <circle cx="17" cy="4" r="0.5" fill="currentColor" />
        <circle cx="18" cy="5" r="0.5" fill="currentColor" />
      </svg>
    </div>
  );
};

export default Logo;
