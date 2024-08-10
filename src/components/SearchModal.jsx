import search from "../assets/search.svg";
import leftArrow from "../assets/left_arrow.svg";

// if isSearching true, show search icon
// if isSearching false, show left arrow icon
function SearchModal({ isSearching }) {
  return (
    <div className="flex justify-center">
      <label className="w-[340px] mt-4 bg-gray-800 bg-opacity-80 rounded input input-bordered flex items-center gap-2 text-[#B9B9B9]">
        {isSearching ? (
          <img src={search} alt="search" className="w-4 h-4" />
        ) : (
          <img src={leftArrow} alt="search" className="w-4 h-4" />
        )}

        <input
          type="text"
          className="grow rounded"
          placeholder="장소를 검색하세요"
        />
      </label>
    </div>
  );
}

export default SearchModal;
