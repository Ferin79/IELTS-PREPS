import React from "react";
import Spinner from "react-bootstrap/Spinner";

const LoadingScreen = ({ text }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "90vh",
        width: "100vw",
      }}
    >
      <Spinner animation="border" variant="primary" />
      <h3 style={{ textAlign: "center", margin: 20 }}>{text}</h3>
    </div>
  );
};
export default LoadingScreen;
