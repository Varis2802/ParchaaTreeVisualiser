import React, { useState, useEffect } from "react";
import logo from "../../../Assets/parchaa-ai-service.png";
import "./data-generation.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnimatedCanvas from "../../../Components/progress";
import Sidebar from "../../../Components/Sidebar";
import { CCAPI } from "../../../APIS";
import axios from "axios";

function DataGeneration() {
  const [cc, setCC] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSubmitted, setUploadSubmitted] = useState(true);
  const [progress, setProgress] = useState(0); // State to control the progress value
  const [animationStarted, setAnimationStarted] = useState(false); // State to control the animation start
  const [allCC, setAllcc] = useState(["fever", "Cough", "cold"]);
   const [error ,setError] =useState(false)

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
    setAnimationStarted(true)
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
    //   const updatedData = {
    //     status: "Running"
    //   };
    
    //   // Send the PATCH request using Axios
    //   axios.patch(`${CCAPI}${cc}`, updatedData)
    //     .then(response => {
    //       toast.success('Successfully updated');
    //     })
    //     .catch(error => {
    //       toast.error('Error updating')
    //     });
    } 
    
    catch (error) {
      toast.error("Error starting data generation!");
      // console.error("There was an error with the fetch operation: ", error);
      setAnimationStarted(false);
      setError(true)
      // const updatedData = {
      //   status: "failed"
      // };
    
      // // Send the PATCH request using Axios
      // axios.patch(`${CCAPI}${cc}`, updatedData)
      //   .then(response => {
      //     toast.success('Successfully updated');
      //   })
      //   .catch(error => {
      //     toast.error('Error updating')
      //   });
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

  // useEffect (()=>{
  //     const url = `${CCAPI}${cc}`;
  //     axios.get(url)
  //       .then(response => {
  //         console.log('Data received:', response.data);
  //         setCC(response.chief_complaint)
  //         setCC("Cough")
  //         setData(response)
  //       })
  //       .catch(error => {
  //         // Handle errors
  //         console.error('Error fetching data:', error);
  //       });
  // },[cc])

  // logic for allcc

  // useEffect (()=>{
  //     const url = `allapi`;
  //     axios.get(url)
  //       .then(response => {
  //         console.log('Data received:', response.data);
  //        setAllcc(response)
  //       })
  //       .catch(error => {
  //         // Handle errors
  //         console.error('Error fetching data:', error);
  //       });
  // },[])

  const handleCCChange = (cc) => {
    // console.log(cc)
    setCC(cc);
    const isCCPresent = allCC.includes(cc);
    if (isCCPresent) {
      toast.error("This Chief Complent allready Present!");
      const cheif_complete = allCC.find((cc1) => cc1 == cc);
      const url = `${CCAPI}${cheif_complete}`;
      axios
        .get(url)
        .then((response) => {
          console.log("Data received:", response.data);
          if (response.data.final_levels) {
            toast.error("For this Chief Complaint Final Level is Genrated!");
          } 
        })
        .catch((error) => {
          // Handle errors
          toast.error("Something Went Wrong!");
          console.error("Error fetching data:", error);
        });
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
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
                    onChange={(event) => {
                      handleCCChange(event.target.value);
                    }}
                    required
                  />

                  <input
                    className="file-uploader"
                    type="file"
                    name="docfile"
                    onChange={onFileChange}
                    required
                  />
                  <button type="submit">Upload</button>
                </form>
              </div>
            )}
            <>
              {uploadSubmitted && (
                <>
                  <button className="run-endpoint" onClick={runEndpoints}>
                    {error?"Restart Genrating Data":"Start Generating Data"}
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
