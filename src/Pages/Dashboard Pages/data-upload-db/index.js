import React from "react";
import { toast } from "react-toastify";
import Sidebar from "../../../Components/Sidebar";
import "./data-upload-db.css";
function DataUploadDB() {

  const runAppend = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/run-append/", {
        method: "POST",
      });

      const data = await response.json(); // Parse JSON response
      console.log(data); // Log entire response

      if (!response.ok) {
        toast.error("Files Not Append Succefully");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        toast.error("Files Append Succefully");
      }
    } catch (error) {
      toast.error("May Be append functionality not working");
    }
  };
  const runCorrection = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/run-correction/", {
        method: "POST",
      });

      const data = await response.json(); // Parse JSON response
      console.log(data); // Log entire response

      if (!response.ok) {
        toast.error("File cant correct");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        toast.error("File Corrected");
      }
    } catch (error) {
      toast.error("May Be correct functionality not working");
    }
  };
  const runDeleteNodes = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/delete-file/", {
        method: "POST",
      });

      const data = await response.json(); // Parse JSON response
      console.log(data); // Log entire response

      if (!response.ok) {
        toast.error("File cant correct");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        toast.error("File Corrected");
      }
    } catch (error) {
      toast.error("May Be correct functionality not working");
    }
  };
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="dashboard-page-right-container">
        <div className="container">
          {/* Column 1: Buttons */}
          <div className="buttons-column">
            <div className="button-wrapper-2">
              <button onClick={runAppend}>Concatenation of levels</button>
              <button onClick={runCorrection}>Data Correction</button>
              <button onClick={runDeleteNodes}>Delete Extra Nodes</button>
              <button>Get CC.json</button>
              <button>Upload To DB</button>
            </div>
          </div>

          {/* Column 2: JSON File */}
          <div className="json-column">
            <div className="json-file">{/* Your JSON content goes here */}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataUploadDB;
