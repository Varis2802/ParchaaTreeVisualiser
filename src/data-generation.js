import React, { useState } from "react";
import logo from "./parchaa-ai-service.png";
import "./data-generation.css";

function Data_generation() {
  const [cc, setCC] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // create a FormData object
    const formData = new FormData();

    // append the data
    formData.append('file', selectedFile);
    formData.append('cc', cc);

    // Here is the fetch call to your backend
    const response = await fetch(
      `http://localhost:5000/call-to-openai`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const data = await response.json();

    // Here you could handle the response from the server
    console.log(data);
  };

  const onFileChange = event => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="main">
      <div className="main-container">
        <div className="login-container">
          <div className="logo">
            <img src={logo} alt="Parchaa-Cortex-IMG" />
          </div>
          <h1>Welcome to Parchaa Ai-Service</h1>
          <h4>Please enter required information</h4>
          <form className="input-grid" onSubmit={handleSubmit}>
            <input
              type="cc"
              name="cc"
              placeholder="Enter Chief Complaint"
              className="input1"
              value={cc}
              onChange={(event) => setCC(event.target.value)}
            />
            <input type="file" name="docfile" onChange={onFileChange} />
            <button type="submit">Upload</button>
          </form>
        </div>
      </div>
      <div className="copyright">© Design By Varis. All Rights Reserved.</div>
    </div>
  );
}

export default Data_generation;
