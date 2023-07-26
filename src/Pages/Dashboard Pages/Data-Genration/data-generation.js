import React, { useState, useEffect } from "react";
import logo from "../../../Assets/parchaa-ai-service.png";
import "./data-generation.css";
// import myGif from "../../../Assets/giphy.webp";
// import Sidebar from "../../../Components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnimatedCanvas from "../../../Components/progress";
import Sidebar from "../../../Components/Sidebar";

function DataGeneration() {
  const [cc, setCC] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSubmitted, setUploadSubmitted] = useState(false);
  const [progress, setProgress] = useState(0); // State to control the progress value
  const [animationStarted, setAnimationStarted] = useState(false); // State to control the animation start
  const handleSubmit = async (event) => {
    event.preventDefault();

    // create a FormData object
    const formData = new FormData();

    // append the data
    formData.append("file", selectedFile);
    formData.append("cc", cc);

    try {
      // Here is the fetch call to your backend
      const response = await fetch(`http://127.0.0.1:8000/upload-file/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        setUploadSubmitted(true);
        toast.success("File uploaded successfully!");
      } else {
        toast.error("Error uploading file!");
      }
    } catch (error) {
      // Handle any errors that might occur during the fetch call
      toast.error("An error occurred while uploading the file.");
      // console.error("Error uploading file:", error);
    }
  };

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // ... other functions

  const runEndpoints = async () => {
    setProgress(0);
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
      toast.success("Data generation started successfully!");
      console.log(data);
    } catch (error) {
      toast.error("Error starting data generation!");
      // console.error("There was an error with the fetch operation: ", error);
      setAnimationStarted(false);
    } finally {
      // setDisplayProgress(false); // Hide the progress bar after data generation completes
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
    <div style={{display:"flex"}}>
      <Sidebar/>
      <div className="main1">
        <ToastContainer />
        <div className="main-container1">
          <div className="login-container">
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
                  {animationStarted && (
                    <AnimatedCanvas
                      percentage={progress}
                      startAnimation={animationStarted}
                    />
                  )}
                </>
              )}
            </>
          </div>
        </div>

        <div className="copyright">© Design By Varis. All Rights Reserved.</div>
      </div>
    </div>
  );
}

export default DataGeneration;
