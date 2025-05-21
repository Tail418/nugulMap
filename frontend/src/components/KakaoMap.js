import React, { useEffect, useMemo, useRef, useState } from "react";

const KakaoMap = ({ onAddZone }) => {
  const mapRef = useRef(null);
  const clickMarkerRef = useRef(null);
  const [clickedLatLng, setClickedLatLng] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.648841453089, 127.064317548529),
          level: 2,
        };
        const map = new window.kakao.maps.Map(container, options);
        mapRef.current = map;

        window.kakao.maps.event.addListener(map, "click", function(mouseEvent) {
          const latlng = mouseEvent.latLng;
          setClickedLatLng({ lat: latlng.getLat(), lng: latlng.getLng() });

          if (!clickMarkerRef.current) {
            clickMarkerRef.current = new window.kakao.maps.Marker({
              position: latlng,
              map: map,
            });
          } else {
            clickMarkerRef.current.setPosition(latlng);
            clickMarkerRef.current.setMap(map);
          }
        });
      });
    };

    return () => {
      script.remove();
      if (clickMarkerRef.current) {
        clickMarkerRef.current.setMap(null);
        clickMarkerRef.current = null;
      }
    };
  }, [onAddZone]);

  return (
    <div>
      <div
        id="map"
        style={{
          margin: "0 auto",
          width: "100%",
          maxWidth: "100%",
          height: "120vw",
          maxHeight: "180vh",
          minHeight: "600px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        }}
      />
      {clickedLatLng && (
        <div
          style={{
            textAlign: "center",
            marginTop: "16px",
            background: "#fff8f0",
            borderRadius: "8px",
            padding: "16px",
            width: "90vw",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            fontSize: "clamp(14px, 3vw, 18px)",
          }}
        >
          <div style={{ marginBottom: "8px", color: "#6d4c2f" }}>
            <b>위도:</b> {clickedLatLng.lat} <br />
            <b>경도:</b> {clickedLatLng.lng}
          </div>
          <button
            style={{
              padding: "10px 24px",
              background: "#8B5C2A",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "clamp(15px, 4vw, 18px)",
              width: "100%",
              maxWidth: "300px",
            }}
            onClick={() => {
              if (onAddZone) {
                onAddZone(clickedLatLng);
              }
            }}
          >
            흡연구역 추가하기
          </button>
        </div>
      )}
    </div>
  );
};

export default KakaoMap;