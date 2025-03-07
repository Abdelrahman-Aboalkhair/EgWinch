"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error;
  reset: () => void;
}

const GlobalError: React.FC<GlobalErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <AlertTriangle className="w-16 h-16 text-red-600 mb-4" />
      <h1 className="text-2xl font-bold text-red-600">Something went wrong!</h1>
      {/* <p className="text-gray-700 mt-2">{error.message}</p> */}
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-primary text-white rounded-md shadow-md hover:bg-primary-dark transition"
      >
        Try Again
      </button>
    </div>
  );
};

export default GlobalError;
