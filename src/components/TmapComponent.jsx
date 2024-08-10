import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./TmapComponent.css";
import { gradientColorsHex } from "./mapUtils";
import { useForm } from "react-hook-form";
import SearchModal from "./SearchModal";
import SearchResult from "./SearchResult"
import { useRecoilState, useRecoilValue } from "recoil";
import { isClickDeState, isSearchingState, markerState } from "../atom/mapState";
import LocationSelector from "./LocationSelector";


const CurrentMarker = `
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="18" cy="18" r="17" fill="#00FFAE" fill-opacity="0.5"/>
<g filter="url(#filter0_d_141_896)">
<circle cx="18" cy="18" r="8" fill="#009DFF"/>
<circle cx="18" cy="18" r="6.5" stroke="white" stroke-width="3"/>
</g>
<defs>
<filter id="filter0_d_141_896" x="0" y="0" width="36" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.615686 0 0 0 0 1 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_141_896"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_141_896" result="shape"/>
</filter>
</defs>
</svg>

`


const TmapComponent = () => {
  const mapRef = useRef(null);
  const tmapInstanceRef = useRef(null); // 지도 객체를 저장하는 Ref
  const [markers, setMarkers] = useRecoilState(markerState)
  const isSearching = useRecoilValue(isSearchingState)
  const isClickDe = useRecoilValue(isClickDeState)
  const { register, handleSubmit } = useForm()


  const onValid = (data) => {
    const fullAddr = data.search
    console.log(fullAddr)

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

        setMarkers(prev => [...prev, { lat: lat, lon: lon }])
      })
      .catch(error => {
        console.error('Error:', error);

      });
  }

  useEffect(() => {
    const initTmap = async () => {
      if (!tmapInstanceRef.current && window.Tmapv2 && mapRef.current) {
        // 지도 생성
        tmapInstanceRef.current = new window.Tmapv2.Map(mapRef.current, {
          center: new window.Tmapv2.LatLng(36.071593, 129.341927),
          width: "100vw",
          height: "100vh",
          zoom: 16,
          scrollwheel: false,
        });


        new window.Tmapv2.Circle({
          center: new window.Tmapv2.LatLng(36.071593, 129.341927),
          radius: 100,
          fillColor: "#00FFAE",
          fillOpacity: 0.5,
          strokeColor: "#00FFAE",
          strokeOpacity: 0,
          map: tmapInstanceRef.current,
        })

        new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(36.071593, 129.341927),
          iconHTML: CurrentMarker,
          iconSize: new window.Tmapv2.Size(35, 18),
          map: tmapInstanceRef.current,
        });



        //출발 마커
        // new window.Tmapv2.Marker({
        //   position: new window.Tmapv2.LatLng(35.8386809, 129.2880871),
        //   iconHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" class="size-6">
        //   <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
        //   <path fill-rule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clip-rule="evenodd" />
        // </svg>`,
        //   map: tmapInstanceRef.current,
        // });

        // // 도착 마커
        // new window.Tmapv2.Marker({
        //   position: new window.Tmapv2.LatLng(35.8444176, 129.2852572),
        //   iconHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="blue" class="size-6">
        //   <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
        //   <path fill-rule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clip-rule="evenodd" />
        // </svg>`,
        //   map: tmapInstanceRef.current,
        // });

        // // 경로 탐색 API 호출
        // try {
        //   const headers = { "appKey": import.meta.env.VITE_TMAP_API_KEY };
        //   const response = await axios.post(
        //     "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json",
        //     {
        //       startX: "129.2880871",
        //       startY: "35.8386809",
        //       endX: "129.2852572",
        //       endY: "35.8444176",
        //       reqCoordType: "WGS84GEO",
        //       resCoordType: "EPSG3857",
        //       startName: "출발지",
        //       endName: "도착지",
        //     },
        //     { headers }
        //   );

        //   const resultData = response.data.features;

        //   const drawInfoArr = [];
        //   let segmentColors = [];

        //   resultData.forEach((item) => {
        //     const { geometry, properties } = item;
        //     if (geometry.type === "LineString") {
        //       geometry.coordinates.forEach((coord, index) => {
        //         const latlng = new window.Tmapv2.Point(coord[0], coord[1]);
        //         const convertedPoint = new window.Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
        //         drawInfoArr.push(new window.Tmapv2.LatLng(convertedPoint._lat, convertedPoint._lng));
        //       });
        //     }
        //   });

        //   // 그라디언트 색상 배열 생성
        //   segmentColors = gradientColorsHex(drawInfoArr.length - 1);

        //   drawLine(drawInfoArr, segmentColors);
        // } catch (error) {
        //   console.error("Error fetching route:", error);
        // }
      }
    };

    // 마커 추가
    markers.forEach(marker => {
      new window.Tmapv2.Marker({
        position: new window.Tmapv2.LatLng(marker.lat, marker.lon),
        map: tmapInstanceRef.current,
      });
      // 지도 중심 이동
      tmapInstanceRef.current.setCenter(new window.Tmapv2.LatLng(marker.lat, marker.lon));

    });
    // const drawLine = (arrPoint, colors) => {
    //   const drawInfoArr = [];

    //   for (let i = 0; i < arrPoint.length - 1; i++) {
    //     const polyline = new window.Tmapv2.Polyline({
    //       path: [arrPoint[i], arrPoint[i + 1]],
    //       strokeColor: colors[i],
    //       strokeWeight: 10,
    //       map: tmapInstanceRef.current,
    //     });
    //     drawInfoArr.push(polyline);
    //   }

    //   setResultDrawArr((prevArr) => [...prevArr, ...drawInfoArr]);
    // };

    initTmap();
  }, [markers]);




  return (
    <>
      <div className='relative  z-10 px-5 pt-2'>

        {!isClickDe ? <SearchModal /> : null}
        {isSearching ?
          <SearchResult />
          : null}

        {isClickDe ? <LocationSelector /> : null}
      </div>

      <div className="map fixed top-0 left-0 z-0" ref={mapRef} />
    </>


  )
    ;
};

export default TmapComponent;
