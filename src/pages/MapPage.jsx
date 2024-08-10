import { useRecoilValue } from "recoil";
import { isSearchingState } from "../atom/mapState";
import LocationSelector from "../components/LocationSelector";
import SearchModal from "../components/SearchModal";
import SearchResult from "../components/SearchResult";

function MapPage() {
  const isSearching = useRecoilValue(isSearchingState);

  return (
    <div className="relative w-full h-screen bg-black">
      {/* <LocationSelector /> */}
      <SearchModal />
      {/* <SearchResult /> */}
    </div>
  );
}

export default MapPage;
