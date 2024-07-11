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
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center gap-4 p-4">
        <GiFingerPrint className="text-8xl animate-ping absolute inline-flex rounded-full text-sky-400 opacity-75" />
        <GiFingerPrint className="text-8xl relative inline-flex rounded-full text-sky-500" />
      </div>
      <div className="mt-4 text-2xl">
        {percentage}%
      </div>
      <div className="w-full max-w-md mt-4">
        <div className="h-4">
          <div
            className="h-4 bg-sky-500 rounded"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FingerprintLoading;
