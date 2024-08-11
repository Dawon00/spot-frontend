import React from "react";
import { useRecoilState } from "recoil";
import {
  beforeState,
  departureState,
  destinationState,
  isClickDeState,
  isSearchingState,
  markerState,
} from "../atom/mapState";

function SearchResult() {
  const [before, setBefore] = useRecoilState(beforeState);

  const [dep, setDep] = useRecoilState(departureState);
  const [dest, setDest] = useRecoilState(destinationState);

  const [isSearching, setIsSearching] = useRecoilState(isSearchingState);
  const [isClickDe, setIsClickDe] = useRecoilState(isClickDeState);

  const [markers, setMarkers] = useRecoilState(markerState);
  console.log(markers);

  return (
    <div className="h-[170px] flex flex-col justify-around fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#323232] to-[#525252] opacity-80 text-white p-6 rounded-t-3xl">
      <div className="flex justify-between">
        <div className="text-3xl">{before}</div>
        <div className="text-2xl bg-gray-800 bg-opacity-90 px-4 py-1 rounded-2xl">
          12km
        </div>
      </div>

      <div className="flex text-[#F1F1F1]">
        <div
          className="w-1/2 flex justify-center"
          onClick={() => {
            setDep(before);
            setIsSearching(false);
            setIsClickDe(true);
          }}
        >
          From
        </div>
        <div>|</div>
        <div
          className="w-1/2 flex justify-center"
          onClick={() => {
            setDest(before);
            setIsSearching(false);
            setIsClickDe(true);
          }}
        >
          To
        </div>
      </div>
    </div>
  );
}

export default SearchResult;
