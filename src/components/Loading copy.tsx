

import React, { useState, useEffect } from "react";
import Lottie from "react-lottie";
import animationData from "../../public/bio-animation.json";

const FingerprintLoading = () => {
  const [percentage, setPercentage] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="flex items-center gap-4 p-4">
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
          isStopped={isStopped}
          isPaused={isPaused}
        />
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

