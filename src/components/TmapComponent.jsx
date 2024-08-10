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
  isArrivedState,
  isClickDeState,
  isMapState,
  isSearchingState,
  markerState,
  stopOverState,
} from "../atom/mapState";

import LocationSelector from "./LocationSelector";
import WideButton from "./WideButton";
import { getOrangSpot } from "../assets/OrangeSpot";
import { DepMarker } from "../assets/DepMarker";
import { DestMarker } from "../assets/DestMarker";
import { CurrentMarker } from "../assets/CurrentMarker";
import { normalizeWeights } from "../\butils/normalizeWeights";

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

  const [clickLat, setClickLat] = useState(null)
  const [clickLng, setClickLng] = useState(null)

  const [isClick, setIsClick] = useState(0)

  const polylineRef = useRef([]); // Polyline 객체들을 저장하는 Ref

  const [spots, setSpots] = useState([]);
  const [string, setString] = useState("출발!")

  const [isArrive, setIsArrive] = useRecoilState(isArrivedState)


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

        setMarkers((prev) => [...prev, { type: "pending", lat: lat, lng: lon }]);
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


      }
    };

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
        tmapInstanceRef.current.setCenter(
          new window.Tmapv2.LatLng(marker.lat, marker.lon)
        );

      });




    }
    const drawLine = (arrPoint, colors, isAvoid) => {
      // 기존의 모든 Polyline 삭제
      if (isAvoid) {
        polylineRef.current.forEach((polyline) => polyline.setMap(null));
        polylineRef.current = [];
      }


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
      polylineRef.current = drawInfoArr; // 새로운 Polyline 객체들 저장
    };

    if (isMap) {
      const fetchRoute = async (startX, startY, endX, endY, isAvoid) => {
        try {
          const headers = { appKey: import.meta.env.VITE_TMAP_API_KEY };
          const response = await axios.post(
            "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json",
            {
              startX: startX,
              startY: startY,
              endX: endX,
              endY: endY,
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
          drawLine(drawInfoArr, segmentColors, isAvoid);
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      };


      // 모바일 이벤트 리스너 추가
      tmapInstanceRef.current.addListener("click", function (e) {
        setClickLat(e.latLng.lat())
        setClickLng(e.latLng.lng())
        setIsClick((prev) => prev + 1)
      });

      if (isClick === 0) {
        async function fetchOne() {
          await fetchRoute(initial.lng, initial.lat, markers[0].lon, markers[0].lat, true);
        }

        fetchOne()
      } else {
        async function fetchRoutes() {
          await fetchRoute(initial.lng, initial.lat, clickLng, clickLat, true);
          await fetchRoute(clickLng, clickLat, markers[0].lon, markers[0].lat, false);
        }

        // fetchRoutes 함수를 호출하여 순차적으로 실행
        fetchRoutes();
      }


    }



    initTmap();
  }, [isMap, initial, markers, clickLat, clickLng]);


  useEffect(() => {
    const bounds = tmapInstanceRef.current.getBounds()
    axios.get(`https://spot.tonggn.com/spots?startLatitude=${bounds._sw._lat}&startLongitude=${bounds._sw._lng}&endLatitude=${bounds._ne._lat}&endLongitude=${bounds._ne._lng}`)
      .then(res => {
        const data = normalizeWeights(res.data.spots)

        data.map(item => {
          const orange = getOrangSpot(item.normalizedWeight, item.normalizedWeight)

          new window.Tmapv2.Marker({
            position: new window.Tmapv2.LatLng(item.latitude, item.longitude),
            iconHTML: orange,
            map: tmapInstanceRef.current,
          });
        })

      }).catch(err => console.log(err))

  }, [])
  useEffect(() => {
    console.log(markers)
  }, [])


  return (
    <>
      <div className="relative  z-10 px-5 pt-2">
        {!isClickDe ? <SearchModal /> : null}
        {isSearching ? <SearchResult /> : null}

        {isClickDe ? <LocationSelector /> : null}

        {isClickDe ? (
          <div
            className="fixed w-full bottom-4 left-0 px-3"
            onClick={() => {
              setString((prev) => {
                if (prev === "출발!") {
                  return "도착!"
                } else {
                  setIsArrive(true)
                  return "도착!"
                }
              })
              setIsMap(true)
            }}
          >
            <WideButton>{string}</WideButton>
          </div>
        ) : null}
      </div>

      <div className="map fixed top-0 left-0 z-0" ref={mapRef} />
    </>
  );
};

export default TmapComponent;
