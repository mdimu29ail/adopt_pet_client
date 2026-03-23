import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex space-x-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full bg-orange-400 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
      <p className="mt-6  font-semibold text-lg">Loading, please wait...</p>
    </div>
  );
};

export default Loading;
