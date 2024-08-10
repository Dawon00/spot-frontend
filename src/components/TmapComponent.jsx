import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./TmapComponent.css";

const TmapComponent = () => {
  const mapRef = useRef(null);
  const tmapInstanceRef = useRef(null); // 지도 객체를 저장하는 Ref
  const [result, setResult] = useState("");
  const [resultDrawArr, setResultDrawArr] = useState([]);

  const hexToRgb = (hex) => {
    let r = 0, g = 0, b = 0;
    // 3자리 HEX 코드 처리
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
    // 6자리 HEX 코드 처리
    else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    return [r, g, b];
  };

  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  };

  const gradientColorsHex = (steps) => {
    const startHex = "#009DFF";
    const endHex = "#00FFAE";
    const startRGB = hexToRgb(startHex);
    const endRGB = hexToRgb(endHex);

    const interpolateColor = (start, end, factor) => {
      const result = start.slice();
      for (let i = 0; i < 3; i++) {
        result[i] = Math.round(start[i] + factor * (end[i] - start[i]));
      }
      return rgbToHex(result[0], result[1], result[2]);
    };

    const colors = [];
    for (let i = 0; i < steps; i++) {
      colors.push(interpolateColor(startRGB, endRGB, i / (steps - 1)));
    }

    return colors;
  };

  useEffect(() => {
    const initTmap = async () => {
      if (!tmapInstanceRef.current && window.Tmapv2 && mapRef.current) {
        // 지도 생성
        tmapInstanceRef.current = new window.Tmapv2.Map(mapRef.current, {
          center: new window.Tmapv2.LatLng(35.8386809, 129.2880871),
          width: "100vw",
          height: "100vh",
          zoom: 16,
          scrollwheel: false,
        });

        // 출발 마커
        new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(35.8386809, 129.2880871),
          iconHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" class="size-6">
          <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
          <path fill-rule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clip-rule="evenodd" />
        </svg>`,
          map: tmapInstanceRef.current,
        });

        // 도착 마커
        new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(35.8444176, 129.2852572),
          iconHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="blue" class="size-6">
          <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
          <path fill-rule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clip-rule="evenodd" />
        </svg>`,
          map: tmapInstanceRef.current,
        });

        // 경로 탐색 API 호출
        try {
          const headers = { "appKey": import.meta.env.VITE_TMAP_API_KEY };
          const response = await axios.post(
            "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json",
            {
              startX: "129.2880871",
              startY: "35.8386809",
              endX: "129.2852572",
              endY: "35.8444176",
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
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      }
    };

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

    initTmap();
  }, []);

  return <div className="map" ref={mapRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default TmapComponent;
