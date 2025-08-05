import React, { useEffect, useRef, useState } from "react";

const KakaoMap = ({ onAddZone }) => {
  const mapRef = useRef(null);
  const clickMarkerRef = useRef(null);
  const myMarkerRef = useRef(null);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [myPosition, setMyPosition] = useState(null);
  const [myAddress, setMyAddress] = useState("");

  // 내 위치 가져오기 및 지도 중심 이동
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMyPosition({ lat, lng });
      },
      () => {
        alert("위치 정보를 가져올 수 없습니다.");
      }
    );
  }, []);

  // 카카오맵 로드 및 내 위치 마커 표시
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const defaultCenter = new window.kakao.maps.LatLng(37.648841453089, 127.064317548529);
        const options = {
          center: myPosition
            ? new window.kakao.maps.LatLng(myPosition.lat, myPosition.lng)
            : defaultCenter,
          level: 2, // 지도 확대 레벨
        };
        const map = new window.kakao.maps.Map(container, options);
        mapRef.current = map;

        // 내 위치 마커 표시
        if (myPosition) {
          const myLatLng = new window.kakao.maps.LatLng(myPosition.lat, myPosition.lng);
          myMarkerRef.current = new window.kakao.maps.Marker({
            position: myLatLng,
            map: map,
            image: new window.kakao.maps.MarkerImage(
              process.env.PUBLIC_URL + "/current-location.svg", // public 폴더에 저장한 SVG 경로
              new window.kakao.maps.Size(70, 70)
            ),
            title: "내 위치",
          });
          map.setCenter(myLatLng);

          // 주소 변환
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2Address(myPosition.lng, myPosition.lat, function(result, status) {
            if (status === window.kakao.maps.services.Status.OK) {
              setMyAddress(result[0].address.address_name);
            }
          });
        }

        // 지도 클릭 이벤트
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
      if (myMarkerRef.current) {
        myMarkerRef.current.setMap(null);
        myMarkerRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [myPosition, onAddZone]);

  return (
    <div>
      <div
        id="map"
        style={{
          margin: "0 auto",
          width: "100%",
          maxWidth: "100%",
          height: "280vw", //높이설정
          maxHeight: "70vh",
          minHeight: "1500px", // 최소 높이 설정
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        }}
      />
      {myPosition && (
        <div
          style={{
            textAlign: "center",
            marginTop: "12px",
            background: "#fff8f0",
            borderRadius: "8px",
            padding: "12px",
            width: "90vw",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            fontSize: "clamp(13px, 3vw, 17px)",
          }}
        >
          <div style={{ marginBottom: "6px", color: "#6d4c2f" }}>
            <b>내 위치 주소:</b> {myAddress ? myAddress : "주소를 불러오는 중..."}
            <br />
            <b>위도:</b> {myPosition.lat} <br />
            <b>경도:</b> {myPosition.lng}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default KakaoMap;