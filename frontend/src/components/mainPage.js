import React, { useState, useEffect, useRef } from "react";
import { getAddress } from "./getAddress";
import KakaoMap from "./KakaoMap";


const MainPage = () => {
  const [smokingZones, setSmokingZones] = useState([
    { name: "흡연구역", lat: 37.64906963482072, lng: 127.0630514473348 },
    { name: "흡연구역", lat: 37.64992958530332, lng: 127.06395870684 },
    { name: "흡연구역", lat: 37.64992559411937, lng: 127.06300401143832 },
  ]);
  const [address, setAddress] = useState(""); // 주소 입력값 상태
  const [clickedLatLng, setClickedLatLng] = useState(null); // 클릭한 위치의 위경도
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const clickMarkerRef = useRef(null); // 클릭 마커 ref

  useEffect(() => {
    // 카카오맵 API 로드
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
        drawMarkers(smokingZones);

        // 지도 클릭 이벤트 등록
        window.kakao.maps.event.addListener(map, "click", function(mouseEvent) {
          const latlng = mouseEvent.latLng;
          setClickedLatLng({ lat: latlng.getLat(), lng: latlng.getLng() });

          // 클릭 마커가 이미 있으면 위치만 옮기고, 없으면 새로 생성
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
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      if (clickMarkerRef.current) {
        clickMarkerRef.current.setMap(null);
        clickMarkerRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      drawMarkers(smokingZones);
    }
    // eslint-disable-next-line
  }, [smokingZones]);

  function drawMarkers(zones) {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    zones.forEach((zone) => {
      const markerPosition = new window.kakao.maps.LatLng(zone.lat, zone.lng);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(mapRef.current);

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${zone.name}</div>`,
      });
      window.kakao.maps.event.addListener(marker, "click", () => {
        infoWindow.open(mapRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  }

  // 흡연구역 추가 버튼 클릭 시 동작 (원하면 DB 저장 등 구현)
  const handleAddZoneFromMap = (latlng) => {
    alert(`흡연구역 추가: 위도 ${latlng.lat}, 경도 ${latlng.lng}`);
    // 여기에 DB 저장 로직 추가 가능
  };

  return (
    <div>
      <KakaoMap onAddZone={handleAddZoneFromMap} />
    </div>
  );
};

export default MainPage;