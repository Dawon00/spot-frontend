import React from "react";

function SearchResult() {
  return (
    <div className="h-[170px] flex flex-col justify-around absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-80 text-white p-6 rounded-t-3xl">
      <div className="flex justify-between">
        <div className="text-3xl">경주 힐튼 호텔</div>
        <div className="text-2xl bg-gray-800 bg-opacity-90 px-4 py-1 rounded-2xl">
          12km
        </div>
      </div>

      <div className="flex text-[#F1F1F1]">
        <div className="w-1/2 flex justify-center">출발지</div>
        <div>|</div>
        <div className="w-1/2 flex justify-center">도착지</div>
      </div>
    </div>
  );
}

export default SearchResult;
