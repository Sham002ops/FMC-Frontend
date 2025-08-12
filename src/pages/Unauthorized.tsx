import React from "react";
import { ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Unauthorized: React.FC = () => {
  
  const navigate = useNavigate();
  const handleGoBack = () => {

    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-event-gradient px-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
        <div className="flex justify-center mb-4">
          <ShieldOff className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You're not authorized to view this page.
        </p>
        <button
          onClick={handleGoBack}
          className="bg-violet-700 text-white px-6 py-2 rounded-full hover:bg-violet-900 transition"
        >
          Go Back Home
        </button>
       
      </div>
    </div>
  );
};

export default Unauthorized;
