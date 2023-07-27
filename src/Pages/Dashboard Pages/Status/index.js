import React, { useEffect, useState } from "react";
import Sidebar from "../../../Components/Sidebar";
import Card from "../../../Components/Card";
import "./status.css";
import { CCAPI } from "../../../APIS";
import axios from "axios";

function Status() {
    var Apidata = {
      "id": 2,
      "chief_complaint": "Cough",
      "data": {
          "status": "Start Now",
          "initial_levels": true,
          "final_levels": false,
          "upload_db": false,
          "time_taken": "2 hours"
      },
      "message": "Start Now message"
  }

  const [cc, setCC] = useState("");
  const [data, setData] = useState({});
const [status, setStatus] = useState(false)
  const [allCC, setAllcc] = useState([]);

  useEffect(() => {
    const url = `${CCAPI}${cc}`;
    axios
      .get(url)
      .then((response) => {
        console.log("Data received::", response.data);
        setCC(response.data.cc);
        setData(response.data);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
     console.log(data);
  }, [cc]);



  useEffect(() => {
    const url = `http://localhost:7000/cc-status/get-all-cc`;
    axios
      .get(url)
      .then((response) => {
        console.log("Data received1:", response.data);
        setAllcc(response.data);
        setCC(response.data[0]);
        console.log(cc);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }, []);

  // const cardData = selectedData ? Object.entries(selectedData) : [];
  const handleSelectCC = (cc) => {
    setCC(cc);
    setStatus(true);
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
          {allCC?.map((data, i) => (
            <option key={i} value={data}>
              {data}
            </option>
          ))}
        </select>
        {
          status?<Card data={data} />:<div>Select CC </div>
          }
      </div>
    </div>
  );
}

export default Status;
