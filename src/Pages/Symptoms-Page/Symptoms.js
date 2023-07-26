import React from "react";
import { useNavigate } from "react-router";
import "./symptomes-page.css";

function SymptomesChecker() {
  const navigate = useNavigate();

  return (
    <div className="symptomes-page-wrapper">
      <h1 className="heading">Symptoms Checker</h1>
      <div className="button-wrapper">
      <button onClick={() => navigate("/status")} className="btn-class">
          Data Generation
        </button>
        <button onClick={() => navigate("/instructions ")} className="btn-class">
          Parchaa Cortex
        </button>
        {/* <button onClick={() => navigate("/before7level")} className="btn-class">
          Dashboard
        </button> */}
      </div>
    </div>
  );
}

export default SymptomesChecker;
