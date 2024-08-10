import React, { useEffect, useState } from "react";

const LoadingBar = ({ duration = 3000, isReady }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isReady) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 9) {
            clearInterval(interval);
            return 9;
          }
          return prevProgress + 1;
        });
      }, duration / 9);

      return () => clearInterval(interval);
    }
  }, [isReady, duration]);

  return (
    <div className="flex items-center justify-between w-[200px] ">
      <div className="text-xs mr-2">Start</div>
      {[...Array(9)].map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            index < progress ? "bg-green-500" : "bg-gray-500"
          }`}
        ></div>
      ))}
      <div className="text-xs ml-2">Arrival</div>
    </div>
  );
};

export default LoadingBar;
