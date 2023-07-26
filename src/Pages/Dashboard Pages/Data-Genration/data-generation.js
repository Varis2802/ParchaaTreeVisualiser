import React, { useState, useEffect } from "react";
import logo from "../../../Assets/parchaa-ai-service.png";
import "./data-generation.css";
// import myGif from "../../../Assets/giphy.webp";
// import Sidebar from "../../../Components/Sidebar";

function DataGeneration() {
  const [cc, setCC] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSubmitted, setUploadSubmitted] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
   
    // create a FormData object
    const formData = new FormData();

    // append the data
    formData.append("file", selectedFile);
    formData.append("cc", cc);

    // Here is the fetch call to your backend
    const response = await fetch(`http://127.0.0.1:8000/upload-file/`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setUploadSubmitted(true); // Set uploadSubmitted to true after successful upload
    // Here you could handle the response from the server
    console.log(data);
  };

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // ... other functions

  const runEndpoints = async () => {
    setDisplayProgress(true)
    try {
      // Run the endpoints script
      const response = await fetch(`http://127.0.0.1:8000/run-endpoints/`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Here you could handle the response froa the server
      console.log(data);
    } catch (error) {
      console.error("There was an error with the fetch operation: ", error);
    }
   
  };

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    socket.onmessage = (message) => {
      console.log("Received message:", message.data); // Log received messages
      setLogs((logs) => [...logs, JSON.parse(message.data)]);
    };
  }, []);

  return (
    <div className="main1">
      <div className="main-container1">
        <div className="login-container">
          <div className="logo">
            <img src={logo} alt="Parchaa-Cortex-IMG" />
          </div>
          {!uploadSubmitted && (
            <div className="upload">
              <h1>Welcome to Parchaa Ai-Service</h1>
              <h4>Please enter required information</h4>
              <form className="input-grid" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="cc"
                  placeholder="Enter Chief Complaint"
                  className="input1"
                  value={cc}
                  onChange={(event) => setCC(event.target.value)}
                />
                <input
                  className="file-uploader"
                  type="file"
                  name="docfile"
                  onChange={onFileChange}
                />
                <button type="submit">Upload</button>
              </form>
            </div>
          )}
          <>
            {uploadSubmitted && (
              <>
                <button className="run-endpoint" onClick={runEndpoints}>
                  Start Generating Data
                </button>
              </>
            )}
          </>

          {displayProgress && (
            <div className="logs">
            <progress className="bar" class="progress is-medium is-dark" max="100">45%</progress>
              <div className="hi">
                {logs.map((log, index) => (
                  <p key={index}>{log.data.message}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="copyright">© Design By Varis. All Rights Reserved.</div>
    </div>
  );
}

export default DataGeneration;
