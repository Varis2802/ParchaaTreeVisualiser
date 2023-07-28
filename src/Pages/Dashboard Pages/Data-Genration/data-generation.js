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
  const [uploadSubmitted, setUploadSubmitted] = useState(false);
  const [progress, setProgress] = useState(0); // State to control the progress value
  const [animationStarted, setAnimationStarted] = useState(false); // State to control the animation start
  const [allCC, setAllcc] = useState([]);
  const [error, setError] = useState(false);
<<<<<<< HEAD
  const [logss, setLogs] = useState([]);
  const [generationCompleted, setGenerationCompleted] = useState(false);
=======
  const [totalNumber,setTotalNumber] = useState(0)
>>>>>>> e54a207b71c90187d3d3aa450f3badecdaeea509

  const handleSubmit = async (event) => {
    event.preventDefault();

    async function createFormData() {
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
    }

    var isCCPresent = allCC?.includes(cc);

    if (isCCPresent) {
      const cheif_complete = allCC.filter((cc1) => cc1 == cc);
      // console.log(cheif_complete,"cheif")
      const url = `${CCAPI}${cheif_complete[0]}`;
      axios
        .get(url)
        .then((response) => {
          // console.log("Data received cheif jhghjvj:", response.data.data);
          if (response.data?.data.final_levels) {
            toast.error(
              "For this Chief Complaint Final Level is already Genrated!"
            );
            return;
          } else {
            createFormData();
          }
        })
        .catch((error) => {
          // Handle errors
          toast.error("Something Went Wrong!");
          console.error("Error fetching data:", error);
        });
    } else {
      toast.error("Cheif Compplaint is not present in our Data  Base");
    }
  };

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const runEndpoints = async () => {
    setProgress(0);
    setAnimationStarted(true);

    try {
      // Run the endpoints script
      const response = await fetch(`http://127.0.0.1:8000/run-endpoints/`, {
        method: "POST",
      });

      if (!response.ok) {
        toast.error("Data Genration Failed");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log(data);
      const updatedData = {
        status: "Running",
      };
      // Send the PATCH request using Axios
      axios
        .patch(`${CCAPI}${cc}`, updatedData)
        .then((response) => {
          // toast.success("Successfully updated");
        })
        .catch((error) => {
          setAnimationStarted(false);
          toast.error("Error updating");
        });
    } catch (error) {
      toast.error("Data generation Failed!");
      // console.error("There was an error with the fetch operation: ", error);
      setAnimationStarted(false);
      setError(true);
      setLogs([])
      const updatedData = {
        status: "failed",
      };

      // Send the PATCH request using Axios
      axios
        .patch(`${CCAPI}${cc}`, updatedData)
        .then((response) => {
          toast.success("Status  updated");
        })
        .catch((error) => {
          toast.error("Error updating");
        });
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
=======
  const [logss, setLogs] = useState([]);

  // websokets functionality
// useEffect(() => {
//   const socket = new WebSocket("ws://localhost:8080");
>>>>>>> e54a207b71c90187d3d3aa450f3badecdaeea509

//   socket.onopen = () => {
//     console.log("WebSocket Client Connected");
//   };

//   socket.onmessage = (message) => {
//     // Log received messages
//     console.log("Received message:", message.data);

//     const payload = JSON.parse(message.data);
//     console.log("Received payload:", payload);

//     // Check if the payload message contains "Done"
//     if (payload.data.message.includes("Done")) {
//       // Extract the number from the "Done" message
//       const doneNumber = parseInt(payload.data.message.match(/\d+/)[0]);

//       // Update the progress and totalNumber state based on the "Done" message
//       setProgress(doneNumber);
//       setTotalNumber(doneNumber + 1); // Since it's 0-indexed, the next task will be doneNumber + 1

//       // Show toast message when "Generation Completed!" is received
//       if (payload.data.message.includes("Generation Completed!")) {
//         toast.success("Generation Success!");
//       }
//     }

//     // Update the logss state
//     setLogs((logss) => [...logss, payload]);
//   };
// }, []);


useEffect(() => {
  const socket = new WebSocket("ws://localhost:8080");

  socket.onopen = () => {
    console.log("WebSocket Client Connected");
  };

  socket.onmessage = (message) => {
    const payload = JSON.parse(message.data);
    console.log("Received payload:", payload);

    setLogs((logss) => [...logss, payload]);

    // Process the "Done" messages to update progress and display generation success toast



        // Extract the total number from the "message" field in the payload
        const totalNumRegex = /"Total_number: (\d+)"/;
        const totalNumMatch = payload.data.message.match(totalNumRegex);
        const totalNum = totalNumMatch ? parseInt(totalNumMatch[1]) : 0;
    
        // Extract the "Done" messages from the "message" field in the payload
        const doneRegex = /"Done (\d+)"/g;
        const doneMatches = payload.data.message.match(doneRegex);
    
        // Calculate the progress based on the number of "Done" messages
        const doneCount = doneMatches ? doneMatches.length : 0;
        const newProgress = doneCount / totalNum * 100;
    // const doneMessages = payload.data.message.match(/Done \d+/g);
    if (doneMatches) {
      // const progress = doneMessages.length / totalTasks; // Assuming you have a state variable totalTasks that holds the total number of tasks
      setProgress(newProgress);
    }

    if (payload.data.message.includes("Generation Completed!")) {
      toast.success(`Generation success for ${payload?.data?.chief_complaint}!`);
      setProgress(100)
    }
  };
}, []);

<<<<<<< HEAD
    socket.onmessage = (message) => {
      const payload = JSON.parse(message.data);
      console.log("Received payload:", payload);

      // Update the logs state
      setLogs((logss) => [...logss, payload]);

      // Extract the progress from the "Done" message and update the state
      const doneMessageRegex = /Done (\d+)/;
      const match = payload.data.message.match(doneMessageRegex);

      
      
      if (match) {
        const progressValue = parseInt(match[1]);
        setProgress(progressValue);
      }

      // Check if generation is completed and trigger the toast message
      if (payload.data.message.includes("Generation Completed!")) {
        setGenerationCompleted(true);
        toast.success("Generation success!");
      }
    };
  }, []);
=======

>>>>>>> e54a207b71c90187d3d3aa450f3badecdaeea509

  useEffect(() => {
    const url = `https://bb87-2401-4900-1f37-eeba-d58a-5b5e-3fbd-a8cf.ngrok-free.app/cc-status/get-all-cc`;
    axios
      .get(url)
      .then((response) => {
        //  console.log("Data received:", response.data);
        setAllcc(response.data);
        // console.log(allCC);
      })
      .catch((error) => {
        // Handle errors
        // console.error("Error fetching data:", error);
        toast.error("error fetching data try again some times");
      });
  }, []);

  const handleCCChange = (event) => {
    // console.log(cc)
    setCC(event.target.value);
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
                  <label htmlFor="cc">Select Chief complaint:</label>
                  <select
                    id="cc"
                    name="cc"
                    className="dropdown"
                    value={cc}
                    onChange={handleCCChange}
                  >
                    {allCC?.map((cc) => {
                      return <option value={cc}>{cc}</option>;
                    })}

                    {/* <option value="option2">Option 2</option>
              <option value="option3">Option 3</option> */}
                  </select>

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
              {uploadSubmitted && !generationCompleted && (
                <>
                  <button className="run-endpoint" onClick={runEndpoints}>
                    {error
                      ? "Restart Generating Data"
                      : "Start Generating Data"}
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
          <div>
            <h2>Logs:</h2>
            <ul>
              {logss.map((log, index) => (
                <li key={index}>{JSON.stringify(log)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="copyright">© Design By Varis. All Rights Reserved.</div>
      </div>
    </div>
  );
}

export default DataGeneration;
