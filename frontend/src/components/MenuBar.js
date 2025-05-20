import React from "react";

const MenuBar = () => (
  <div
    style={{
      width: "100%",
      background: "#8B5C2A",
      color: "#fff",
      position: "fixed",
      bottom: 0,
      left: 0,
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      height: "56px",
      zIndex: 1000,
      fontWeight: "bold",
      fontSize: "clamp(14px, 3vw, 18px)",
      letterSpacing: "1px",
      boxShadow: "0 -2px 8px rgba(0,0,0,0.07)",
      minWidth: "320px",
    }}
  >
    <div style={{ flex: 1, textAlign: "center" }}>메인페이지</div>
    <div style={{ flex: 1, textAlign: "center" }}>문의사항</div>
    <div style={{ flex: 1, textAlign: "center" }}>개발자</div>
  </div>
);

export default MenuBar;