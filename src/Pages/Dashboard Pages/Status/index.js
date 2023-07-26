import React, { useState } from "react";
import Sidebar from "../../../Components/Sidebar";
import Card from "../../../Components/Card";
import "./status.css";

function Status() {
  var Apidata = [
    {
      id: 1,
      chief_complaint: "Fever",
      data: {
        status: "Running",
        after_7_level: true,
        before_7_level: true,
        data_upload_to_db: false,
        data_completion_time: "2 hours",
      },
      message: "Progress bar",
    },
    {
      id: 2,
      chief_complaint: "Cough",
      data: {
        status: "Start Now",
        after_7_level: false,
        before_7_level: false,
        data_upload_to_db: false,
        data_completion_time: "2 hours",
      },
      message: "Start Now message",
    },
    {
      id: 3,
      chief_complaint: "Back Pain",
      data: {
        status: "Stopped",
        after_7_level: false,
        before_7_level: true,
        data_upload_to_db: false,
        data_completion_time: "2 hours",
      },
      message: "Blocker",
    },
    {
      id: 4,
      chief_complaint: "Chest Pain",
      data: {
        status: "Success",
        after_7_level: true,
        before_7_level: true,
        data_upload_to_db: true,
        data_completion_time: "2 hours",
      },
      message: "Data Generation Completed",
    },
  ];

  const [cc, setCC] = useState(Apidata[0]?.chief_complaint);
  const selectedData = Apidata.find(
    (item) => item.chief_complaint === cc
  )?.data;

  // const cardData = selectedData ? Object.entries(selectedData) : [];
  const handleSelectCC = (cc) => {
    setCC(cc);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div className="dashboard-page-right-container">
        <select
          className="cc-dropdown"
          value={cc}
          onChange={(e) => handleSelectCC(e.target.value)}
        >
          {Apidata.map((data) => (
            <option key={data.id} value={data.chief_complaint}>
              {data.chief_complaint}
            </option>
          ))}
        </select>
        <Card data={selectedData} />
      </div>
    </div>
  );
}

export default Status;
