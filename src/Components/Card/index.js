import React from "react";
import "./card.css";

function Card({ data }) {
  console.log(data,"fhch");

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
    final_levels: "Final levels",
    initial_levels: "Initial levels",
    status: "Status",
    time_taken: "Data Completion Time",
    upload_db: "Data Upload to DB",
  };

  return (
    <div className="cards-wrapper">
      
      {Object?.entries(data?.data).map(([key, value], index) => (
        <div
          key={index}
          className="card"
          style={
            key === "status"
              ? getBorderStyle(value)
              : value === true
              ? boderfortrue
              : boderforfalse
          }
        >
          <h3>{keyNameMapping[key]}</h3>
          {typeof value === "boolean" ? (
            <h5>{value ? "True" : "False"}</h5>
            ) : (
              <h5>{value}</h5>
              )}
              {key === "status" ? <h5>{data.message}</h5> : ""}
        </div>
      ))}
    </div>
  );
}

export default Card;
