import React from 'react';
import loadImage from '../Assets/Load.png';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img src={loadImage} alt="Loading" className="animate-spin h-32 w-32" />
      <div className="text-xl text-gray-700 mt-4">{message}</div>
    </div>
  );
};

export default Loading;
