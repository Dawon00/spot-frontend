import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./TmapComponent.css";
import { gradientColorsHex } from "./mapUtils";
import { useForm } from "react-hook-form";
import SearchModal from "./SearchModal";
import SearchResult from "./SearchResult";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  initialState,
  isClickDeState,
  isSearchingState,
  markerState,
  stopOverState,
} from "../atom/mapState";

import LocationSelector from "./LocationSelector";
import WideButton from "./WideButton";

const CurrentMarker = `
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="18" cy="18" r="17" fill="#00FFAE" fill-opacity="0.5"/>
<g filter="url(#filter0_d_184_4602)">
<circle cx="18" cy="18" r="8" fill="#009DFF"/>
<circle cx="18" cy="18" r="6.5" stroke="black" stroke-width="3"/>
</g>
<defs>
<filter id="filter0_d_184_4602" x="0" y="0" width="36" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.615686 0 0 0 0 1 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_184_4602"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_184_4602" result="shape"/>
</filter>
</defs>
</svg>


`;


const DepMarker = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_i_75_47370)">
<circle cx="13" cy="13" r="13" fill="#009DFF"/>
</g>
<g filter="url(#filter1_i_75_47370)">
<circle cx="13" cy="13" r="7.94444" fill="white"/>
</g>
<defs>
<filter id="filter0_i_75_47370" x="0" y="0" width="27" height="27" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="1" dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_75_47370"/>
</filter>
<filter id="filter1_i_75_47370" x="5.05556" y="5.05554" width="16.8889" height="16.8889" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="1" dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_75_47370"/>
</filter>
</defs>
</svg>
`;

const DestMarker = `<svg width="56" height="66" viewBox="0 0 56 66" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_85_24104)">
<path d="M13.7886 13.7886C21.3978 6.17938 33.7544 6.17725 41.3657 13.7886C48.9749 21.3977 48.9771 33.7544 41.3657 41.3657L27.5772 55.1543L13.7886 41.3657C6.17727 33.7544 6.17727 21.3999 13.7886 13.7886Z" fill="#5E5E5E"/>
<path d="M14.1421 14.1421C21.5561 6.72816 33.5962 6.7261 41.0122 14.1421C48.4261 21.5561 48.4282 33.5962 41.0122 41.0122L27.5772 54.4472L14.1421 41.0122C6.72608 33.5961 6.72608 21.5582 14.1421 14.1421Z" stroke="#ABABAB"/>
</g>
<path d="M16.78 23.7951C14.0742 26.4931 14.228 30.9659 17.2446 33.4606C19.8845 35.6453 23.7989 35.3511 26.2254 32.9316L32.6258 26.5495C33.6209 25.5573 35.3474 25.4446 36.3895 26.3867C37.5604 27.4447 37.5949 29.2538 36.49 30.3524L30.35 36.4748C29.5967 37.226 29.5967 38.4467 30.35 39.1979C31.1034 39.9491 32.3276 39.9491 33.081 39.1979L39.1362 33.1601C41.5627 30.7406 41.8483 26.8406 39.6479 24.2176C37.1335 21.2222 32.6478 21.0751 29.9388 23.7763L23.3845 30.3118C22.3141 31.3791 20.5751 31.3791 19.5047 30.3118C18.4562 29.2663 18.4562 27.5667 19.5047 26.5213L25.6729 20.3708C26.4263 19.6196 26.4263 18.3989 25.6729 17.6477C24.9195 16.8965 23.6953 16.8965 22.9419 17.6477L16.7769 23.7951L16.78 23.7951Z" fill="url(#paint0_linear_85_24104)"/>
<path d="M28.212 17.2962C29.3824 17.2962 30.3313 16.3474 30.3313 15.1769C30.3313 14.0064 29.3824 13.0576 28.212 13.0576C27.0415 13.0576 26.0926 14.0064 26.0926 15.1769C26.0926 16.3474 27.0415 17.2962 28.212 17.2962Z" fill="#009DFF"/>
<path d="M27.6822 44C28.9112 44 29.9075 43.0037 29.9075 41.7747C29.9075 40.5457 28.9112 39.5494 27.6822 39.5494C26.4531 39.5494 25.4568 40.5457 25.4568 41.7747C25.4568 43.0037 26.4531 44 27.6822 44Z" fill="#00FFAE"/>
<defs>
<filter id="filter0_d_85_24104" x="3.08009" y="8.08087" width="48.9933" height="57.0734" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="5"/>
<feGaussianBlur stdDeviation="2.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_85_24104"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_85_24104" result="shape"/>
</filter>
<linearGradient id="paint0_linear_85_24104" x1="28" y1="17.0843" x2="28" y2="39.7613" gradientUnits="userSpaceOnUse">
<stop stop-color="#009DFF"/>
<stop offset="1" stop-color="#00FFAE"/>
</linearGradient>
</defs>
</svg>
`;

const TmapComponent = () => {
  const mapRef = useRef(null);
  const tmapInstanceRef = useRef(null); // 지도 객체를 저장하는 Ref

  const [markers, setMarkers] = useRecoilState(markerState)
  const isSearching = useRecoilValue(isSearchingState)
  const isClickDe = useRecoilValue(isClickDeState)

  const [initial, setinitial] = useRecoilState(initialState)

  const [isMap, setIsMap] = useRecoilState(isMapState)
  const { register, handleSubmit } = useForm()

  const [initial, setinitial] = useRecoilState(initialState);
  const [stopOver, setStopOver] = useRecoilState(stopOverState);
  const { register, handleSubmit } = useForm();

  const onValid = (data) => {
    const fullAddr = data.search;
    console.log(fullAddr);

    const headers = { appKey: import.meta.env.VITE_TMAP_API_KEY };
    const url =
      "https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&callback=result";

    axios
      .get(url, {
        headers,
        params: {
          coordType: "WGS84GEO",
          fullAddr,
        },
      })
      .then((response) => {
        const resultInfo = response.data.coordinateInfo;
        if (!resultInfo.coordinate.length) {
          // eslint-disable-next-line no-undef
          setResult("요청 데이터가 올바르지 않습니다.");
          return;
        }

        let {
          lon,
          lat,
          lonEntr,
          latEntr,
          newLon,
          newLat,
          newLonEntr,
          newLatEntr,
        } = resultInfo.coordinate[0];

        // 새주소가 있을 경우 처리
        lon = lon || newLon;
        lat = lat || newLat;
        lonEntr = lonEntr || newLonEntr || 0;
        latEntr = latEntr || newLatEntr || 0;
        console.log(lon, lat);


        setMarkers(prev => [...prev, { lat: lat, lng: lon }])
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const initTmap = () => {
      if (!tmapInstanceRef.current && window.Tmapv2 && mapRef.current) {
        tmapInstanceRef.current = new window.Tmapv2.Map(mapRef.current, {
          center: new window.Tmapv2.LatLng(initial.lat, initial.lng),
          width: "100vw",
          height: "100vh",
          zoom: 16,
          scrollwheel: false,
        });

        // 초기 마커 및 원 생성 (기존 코드 유지)
        new window.Tmapv2.Circle({
          center: new window.Tmapv2.LatLng(initial.lat, initial.lng),
          radius: 100,
          fillColor: "#00FFAE",
          fillOpacity: 0.5,
          strokeColor: "#00FFAE",
          strokeOpacity: 0,
          map: tmapInstanceRef.current,
        });

        new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(initial.lat, initial.lng),
          iconHTML: CurrentMarker,
          iconSize: new window.Tmapv2.Size(35, 18),
          map: tmapInstanceRef.current,
        });


        // 모바일 이벤트 리스너 추가
        tmapInstanceRef.current.addListener("touchstart", function (e) {
          const clickedLat = e.latLng.lat();
          const clickedLng = e.latLng.lng();

          // 새로운 마커를 markers 상태에 추가
          setStopOver((prevMarkers) => [
            ...prevMarkers,
            [clickedLat, clickedLng],
          ]);
        });

        // pc 이벤트 리스너 추가
        tmapInstanceRef.current.addListener("click", function (e) {
          const clickedLat = e.latLng.lat();
          const clickedLng = e.latLng.lng();

          // 새로운 마커를 markers 상태에 추가
          setStopOver((prevMarkers) => [
            ...prevMarkers,
            [clickedLat, clickedLng],
          ]);
        });

      }
    };

    initTmap();
  }, [initial, setMarkers]);

  useEffect(() => {
    // 마커 추가
    if (tmapInstanceRef.current) {
      markers.forEach((marker) => {
        new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(marker.lat, marker.lon),
          iconHTML:
            marker.type === "departure"
              ? DepMarker
              : marker.type === "destination"
              ? DestMarker
              : CurrentMarker,
          iconSize: new window.Tmapv2.Size(10, 20),
          map: tmapInstanceRef.current,
        });
      });

      // 지도 중심 이동
      tmapInstanceRef.current.setCenter(new window.Tmapv2.LatLng(marker.lat, marker.lon));

    });

    const drawLine = (arrPoint, colors) => {
      const drawInfoArr = [];

      for (let i = 0; i < arrPoint.length - 1; i++) {
        const polyline = new window.Tmapv2.Polyline({
          path: [arrPoint[i], arrPoint[i + 1]],
          strokeColor: colors[i],
          strokeWeight: 10,
          map: tmapInstanceRef.current,
        });
        drawInfoArr.push(polyline);
      }

      setResultDrawArr((prevArr) => [...prevArr, ...drawInfoArr]);
    };

    if (isMap) {
      //경로 탐색 API 호출
      console.log(markers[0])
      try {
        const headers = { "appKey": import.meta.env.VITE_TMAP_API_KEY };
        const response = axios.post(
          "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json",
          {
            startX: initial.lng,
            startY: initial.lat,
            endX: markers[0].lon,
            endY: markers[0].lat,
            reqCoordType: "WGS84GEO",
            resCoordType: "EPSG3857",
            startName: "출발지",
            endName: "도착지",
          },
          { headers }
        ).then(res => {

          const resultData = res.data.features;
          const drawInfoArr = [];
          let segmentColors = [];

          resultData.forEach((item) => {
            const { geometry, properties } = item;
            if (geometry.type === "LineString") {
              geometry.coordinates.forEach((coord, index) => {
                const latlng = new window.Tmapv2.Point(coord[0], coord[1]);
                const convertedPoint = new window.Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
                drawInfoArr.push(new window.Tmapv2.LatLng(convertedPoint._lat, convertedPoint._lng));
              });
            }
          });

          // 그라디언트 색상 배열 생성
          segmentColors = gradientColorsHex(drawInfoArr.length - 1);

          drawLine(drawInfoArr, segmentColors);

        }).catch(err => conosle.log(err));


      } catch (error) {
        console.error("Error fetching route:", error);
      }
    }




    initTmap();
  }, [markers, isMap]);

  // stopOver 상태가 변경될 때마다 출력
  useEffect(() => {
    console.log(stopOver);
  }, [stopOver]);

  return (
    <>
      <div className="relative  z-10 px-5 pt-2">
        {!isClickDe ? <SearchModal /> : null}
        {isSearching ? <SearchResult /> : null}

        {isClickDe ? <LocationSelector /> : null}

        {isClickDe ?
          <div className="fixed w-full bottom-4 left-0 px-3" onClick={() => setIsMap(true)}>
            <WideButton>다음</WideButton>
          </div>
        ) : null}
      </div>

      <div className="map fixed top-0 left-0 z-0" ref={mapRef} />
    </>
  );
};

export default TmapComponent;
