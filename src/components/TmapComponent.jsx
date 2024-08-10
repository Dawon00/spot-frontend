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
            35.8386809,
            129.2880871
          ),
          width: "800px",
          height: "600px",
          zoom: 18,
        });
      }
    };

    initTmap();
  }, []);

  return <div ref={mapRef} style={{ width: "800px", height: "600px" }} />;
};

export default TmapComponent;
