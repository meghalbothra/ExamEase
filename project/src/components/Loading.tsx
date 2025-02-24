import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loadImage from '../Assets/Load.png';
const Loading = () => {
  const navigate = useNavigate();
useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/continue');
    }, 3000);
return () => clearTimeout(timer);
  }, [navigate]);
return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <img src={loadImage} alt="Loading" className="animate-spin h-32 w-32" />
      <div className="text-xl text-gray-700 ml-4">Loading...</div>
    </div>
  );
};
export default Loading;
