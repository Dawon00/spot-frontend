import { useEffect, useRef } from "react";
import "./TmapComponent.css";

const TmapComponent = () => {
  const mapRef = useRef(null);
  const tmapInstanceRef = useRef(null); // 지도 객체를 저장하는 Ref

  useEffect(() => {
    const initTmap = () => {
      if (!tmapInstanceRef.current && window.Tmapv3 && mapRef.current) {
        tmapInstanceRef.current = new window.Tmapv3.Map(mapRef.current, {
          center: new window.Tmapv3.LatLng(
            37.566481622437934,
            126.98502302169841
          ),
          width: "100%",
          height: "400px",
          zoom: 18,
        });
      }
    };

    initTmap();
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default TmapComponent;
