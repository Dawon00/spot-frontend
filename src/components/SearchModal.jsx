import search from "../assets/search.svg";
import leftArrow from "../assets/left_arrow.svg";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRecoilState } from "recoil";
import { isSearchingState, markerState, beforeState } from "../atom/mapState";

// if isSearching true, show search icon
// if isSearching false, show left arrow icon
function SearchModal() {
  const { register, handleSubmit } = useForm()

  const [markers, setMarkers] = useRecoilState(markerState)
  const [isSearching, setIsSearching] = useRecoilState(isSearchingState)
  const [before, setBefore] = useRecoilState(beforeState)

  const onValid = (data) => {
    const fullAddr = data.search


    const headers = { appKey: import.meta.env.VITE_TMAP_API_KEY };
    const url = 'https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&callback=result';

    axios.get(url, {
      headers,
      params: {
        coordType: 'WGS84GEO',
        fullAddr
      }
    })
      .then(response => {
        const resultInfo = response.data.coordinateInfo;
        if (!resultInfo.coordinate.length) {
          setResult('요청 데이터가 올바르지 않습니다.');
          return;
        }

        let { lon, lat, lonEntr, latEntr, newLon, newLat, newLonEntr, newLatEntr } = resultInfo.coordinate[0];

        // 새주소가 있을 경우 처리
        lon = lon || newLon;
        lat = lat || newLat;
        lonEntr = lonEntr || newLonEntr || 0;
        latEntr = latEntr || newLatEntr || 0;
        console.log(lon, lat)

        setMarkers(prev => [...prev, { type: "destination", lat: lat, lon: lon }])
        setBefore(fullAddr)
        setIsSearching(prev => !prev)
      })
      .catch(error => {
        console.error('Error:', error);

      });
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="flex justify-center">
      <label className="w-[340px] mt-4 bg-gradient-to-r from-[#323232] to-[#525252] opacity-70 rounded input input-bordered flex items-center gap-2 text-[#B9B9B9]">
        {!isSearching ? (
          <img src={search} alt="search" className="w-5 h-5" />
        ) : (
          <img src={leftArrow} alt="search" className="w-6 h-6" />
        )}

        <input
          {...register("search")}
          type="text"
          className="grow rounded"
          placeholder="Search Location"
        />
      </label>
    </form>
  );
}

export default SearchModal;
