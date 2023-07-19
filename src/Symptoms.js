import React from "react";
import { useNavigate } from "react-router";
import "./symptomes-page.css";

function SymptomesChecker() {
  const navigate = useNavigate();

  return (
    <div className="symptomes-page-wrapper">
      <h1 className="heading">Symptoms Checker</h1>
      <div className="button-wrapper">
        <button onClick={() => navigate("/instructions")} className="btn-class">
          Data Generation
        </button>
        <button onClick={() => navigate("/parchaa-cortex")} className="btn-class">
          Decision Tree
        </button>
      </div>
    </div>
  );
}

export default SymptomesChecker;
