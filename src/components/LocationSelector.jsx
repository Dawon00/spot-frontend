import React from "react";
import close from "../assets/Close.svg";

function LocationSelector() {
  return (
    <div className="h-[200px] flex absolute top-0 left-0 right-0 bg-gray-800 bg-opacity-80 text-white p-6 rounded-b-3xl">
      <div className="flex flex-col justify-end w-full">
        <div className="flex">
          <div className="flex-1 pr-6">
            {" "}
            <div className="flex items-center mb-2">
              <span className="mr-3">출발</span>
              <button onClick={() => {}} className="text-[#B9B9B9]">
                출발지
              </button>
            </div>
            <div className="h-px bg-gray-600 my-2"></div>
            <div className="flex items-center">
              <span className="mr-3">도착</span>
              <button onClick={() => {}} className="text-[#B9B9B9]">
                도착지
              </button>
            </div>
          </div>
          <img src={close} alt="close" className="w-4 h-4" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
}

export default LocationSelector;
