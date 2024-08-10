import { useEffect, useRef } from "react";
import "./TmapComponent.css";

const TmapComponent = () => {
  const mapRef = useRef(null);
  const tmapInstanceRef = useRef(null); // 지도 객체를 저장하는 Ref

  useEffect(() => {
    const initTmap = () => {
      const minZoomLevel = 5;
      const maxZoomLevel = 8;

      if (!tmapInstanceRef.current && window.Tmapv3 && mapRef.current) {
        tmapInstanceRef.current = new window.Tmapv3.Map(mapRef.current, {
          center: new window.Tmapv3.LatLng(35.8386809, 129.2880871),
          width: "800px",
          height: "600px",
          zoom: 10,
          minZoom: 10,
          maxZoom: 20
        });

        const marker = new window.Tmapv3.Marker({
          position: new window.Tmapv3.LatLng(35.8386809, 129.2880871), // 마커의 위치 설정
          iconHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" class="size-6">
  <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
  <path fill-rule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clip-rule="evenodd" />
</svg>
`
          ,
          map: tmapInstanceRef.current, // 마커를 표시할 지도 설정
        });


        // tmapInstanceRef.current.on("ConfigLoad", function () {
        //   const circle = new window.Tmapv3.Circle({
        //     center: new window.Tmapv3.LatLng(35.8386809, 129.2880871),
        //     radius: 50,
        //     strokeWeight: 1,
        //     strokeColor: "#B22222",
        //     fillColor: "#B22222",
        //     fillOpacity: 1,
        //     map: tmapInstanceRef.current,
        //   });
        // });

        // mapRef.current.classList.add("tmap-filter-reset");
      }

    };

    initTmap();
  }, []);

  return <div ref={mapRef} style={{ width: "800px", height: "600px" }} />;
};

export default TmapComponent;
