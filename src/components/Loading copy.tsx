import React, { useState, useEffect } from "react";
import { GiFingerPrint } from "react-icons/gi";

const FingerprintLoading = () => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev < 100) {
          return prev + 20;
        } else {
          clearInterval(interval);
          return 100;
        }
      });
    }, 100); // Adjust the interval as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="flex items-center gap-4 p-4">
        <GiFingerPrint className="text-4xl md:text-6xl animate-ping absolute inline-flex rounded-full text-primary opacity-75" />
        <GiFingerPrint className="text-4xl md:text-6xl relative inline-flex rounded-full text-primary" />
      </div>
      <div className="w-40 mt-4 relative">
        <div className="h-3 md:h-5 bg-gray-300 rounded-lg">
          <div
            className="h-3 md:h-5 bg-primary rounded-lg"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-sm font-bold p-1">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default FingerprintLoading;
