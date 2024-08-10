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
  isMapState,
  isSearchingState,
  markerState,
  stopOverState,
} from "../atom/mapState";

import LocationSelector from "./LocationSelector";
import WideButton from "./WideButton";
import { OrangeSpot } from "../assets/OrangeSpot";
import { DepMarker } from "../assets/DepMarker";
import { DestMarker } from "../assets/DestMarker";
import { CurrentMarker } from "./CurrentMarker";

const TmapComponent = () => {
  const mapRef = useRef(null);
  const tmapInstanceRef = useRef(null); // 지도 객체를 저장하는 Ref

  const [markers, setMarkers] = useRecoilState(markerState);
  const isSearching = useRecoilValue(isSearchingState);
  const isClickDe = useRecoilValue(isClickDeState);

  const [isMap, setIsMap] = useRecoilState(isMapState);

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

        setMarkers((prev) => [...prev, { lat: lat, lng: lon }]);
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
      if (markers.length > 0) {
        const lastMarker = markers[markers.length - 1];
        tmapInstanceRef.current.setCenter(
          new window.Tmapv2.LatLng(lastMarker.lat, lastMarker.lon)
        );
      }
    }
  }, [markers]);

  useEffect(() => {
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

      // setResultDrawArr((prevArr) => [...prevArr, ...drawInfoArr]);
    };

    if (isMap && markers.length > 0) {
      const fetchRoute = async () => {
        try {
          const headers = { appKey: import.meta.env.VITE_TMAP_API_KEY };
          const response = await axios.post(
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
          );

          const resultData = response.data.features;
          const drawInfoArr = [];
          let segmentColors = [];

          resultData.forEach((item) => {
            const { geometry } = item;
            if (geometry.type === "LineString") {
              geometry.coordinates.forEach((coord) => {
                const latlng = new window.Tmapv2.Point(coord[0], coord[1]);
                const convertedPoint =
                  new window.Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                    latlng
                  );
                drawInfoArr.push(
                  new window.Tmapv2.LatLng(
                    convertedPoint._lat,
                    convertedPoint._lng
                  )
                );
              });
            }
          });

          segmentColors = gradientColorsHex(drawInfoArr.length - 1);
          drawLine(drawInfoArr, segmentColors);
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      };

      fetchRoute();
    }
  }, [isMap, markers, initial]);

  return (
    <>
      <div className="relative  z-10 px-5 pt-2">
        {!isClickDe ? <SearchModal /> : null}
        {isSearching ? <SearchResult /> : null}

        {isClickDe ? <LocationSelector /> : null}

        {isClickDe ? (
          <div
            className="fixed w-full bottom-4 left-0 px-3"
            onClick={() => setIsMap(true)}
          >
            <WideButton>다음</WideButton>
          </div>
        ) : null}
      </div>

      <div className="map fixed top-0 left-0 z-0" ref={mapRef} />
    </>
  );
};

export default TmapComponent;
