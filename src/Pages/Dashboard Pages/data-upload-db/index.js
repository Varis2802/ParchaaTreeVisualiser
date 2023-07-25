import React from "react";
import Sidebar from "../../../Components/Sidebar";
import "./data-upload-db.css"
function DataUploadDB() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="dashboard-page-right-container">
        <div className="container">
          {/* Column 1: Buttons */}
          <div className="buttons-column">
            <div className="button-wrapper-2" >
              <button>Create JSON</button>
              <button>Upload to DB</button>
            </div>
          </div>
          
          {/* Column 2: JSON File */}
          <div className="json-column">
            <div className="json-file">
              {/* Your JSON content goes here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataUploadDB;
