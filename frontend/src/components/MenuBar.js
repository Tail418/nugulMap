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
      justifyContent: "space-between",
      alignItems: "center",
      height: "100px",
      zIndex: 1000,
      fontWeight: "bold",
      fontSize: "clamp(10px, 4vw, 23px)",
      letterSpacing: "1px",
      boxShadow: "0 -2px 8px rgba(0,0,0,0.07)",
      minWidth: "320px",
    }}
  >
    <button
      style={{
        flex: 1,
        height: "100%",
        background: "none",
        border: "none",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "inherit",
        cursor: "pointer",
      }}
    >
      메인페이지
    </button>
    <div
      style={{
        width: "2px",
        height: "60%",
        background: "#5a3a13",
        borderRadius: "2px",
      }}
    />
    <button
      style={{
        flex: 1,
        height: "100%",
        background: "none",
        border: "none",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "inherit",
        cursor: "pointer",
      }}
    >
      문의사항
    </button>
    <div
      style={{
        width: "2px",
        height: "60%",
        background: "#5a3a13",
        borderRadius: "2px",
      }}
    />
    <button
      style={{
        flex: 1,
        height: "100%",
        background: "none",
        border: "none",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "inherit",
        cursor: "pointer",
      }}
    >
      개발자
    </button>
  </div>
);

export default MenuBar;