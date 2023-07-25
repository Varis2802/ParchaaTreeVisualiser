import React from "react";
import "./card.css";

function Card({ data }) {
  const statusColors = {
    Running: "#4b6af5",
    Stopped: "#f57242",
    Failed: "#f55742",
    Success: "#4bf57e",
    "Start Now": "#f5d442",
  };

  const boderfortrue = {
    border: "3px solid #4b6af5",
  };
  const boderforfalse = {
    border: "3px solid #ff0000",
  };

  const getBorderStyle = (status) => {
    return {
      border: `3px solid ${statusColors[status] || "#ff0000"}`,
    };
  };

  // Mapping to display user-friendly labels for keys
  const keyNameMapping = {
    status: "Status",
    after_7_level: "After 7 Level",
    before_7_level: "Before 7 Level",
    data_upload_to_db: "Data Upload to DB",
    data_completion_time: "Data Completion Time",
  };

  return (
    <div className="cards-wrapper">
      {Object.entries(data).map(([key, status], index) => (
        <div
          key={index}
          className="card"
          style={key === "status" ? getBorderStyle(status) : status ? boderfortrue : boderforfalse}
        >
          {keyNameMapping[key]}
          {/* <img src ={} alt ="logo"/> */}
        </div>
      ))}
    </div>
  );
}

export default Card;
