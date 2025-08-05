import React, { useState, useEffect, useRef } from "react";
import KakaoMap from "./KakaoMap";

const MainPage = () => {
  const [selectedLatLng, setSelectedLatLng] = useState(null); // 지도 클릭한 위치
  const [searchText, setSearchText] = useState("");

  const handleAddZoneFromMap = (latlng) => {
    setSelectedLatLng(latlng);
    alert(`흡연구역 추가 요청됨: 위도 ${latlng.lat}, 경도 ${latlng.lng}`);
    // 여기에 제보 폼 전환 또는 DB 저장 로직 추가 예정
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* 지도 */}
      <KakaoMap onAddZone={handleAddZoneFromMap} />

      {/* 상단 검색창 */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "98vw",           // 크기 확대
          maxWidth: "700px",       // 최대폭 확대
          padding: "18px 32px",    // 패딩 확대
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(6px)",
          borderRadius: "100px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
          zIndex: 999,
        }}
      >
        <input
          type="text"
          placeholder="주소를 입력하세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: "20px",      // 글씨 크기 확대
            padding: "8px 0",      // 입력창 패딩 확대
          }}
        />
        <button
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "24px",      // 아이콘 크기 확대
            color: "#333",
            marginLeft: "12px",    // 버튼 좌측 여백 추가
          }}
          onClick={() => alert(`'${searchText}' 검색 기능은 아직 미구현임`)}
        >
          🔍
        </button>
      </div>

      {/* 하단 고정 버튼 */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90vw",
          maxWidth: "500px",
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          zIndex: 999,
        }}
      >
        <button
          style={{
            flex: 1,
            background: "#8B5C2A",
            color: "#fff",
            padding: "14px 0",
            borderRadius: "12px",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
          onClick={() => alert("제보하기 눌림 (아직 구현 안됨)")}
        >
          제보하기
        </button>
        <button
          style={{
            flex: 1,
            background: "#F0F0F0",
            color: "#333",
            padding: "14px 0",
            borderRadius: "12px",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
          onClick={() => alert("즐겨찾기 보기 (아직 구현 안됨)")}
        >
          즐겨찾기
        </button>
      </div>
    </div>
  );
};

export default MainPage;
