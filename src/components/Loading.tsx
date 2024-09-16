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
      <span className="loading loading-spinner loading-sm"></span> Loading...
    </div>
  );
};

export default FingerprintLoading;