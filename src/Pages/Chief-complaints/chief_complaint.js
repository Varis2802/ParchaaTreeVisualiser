import React, { useState } from "react";
import loginpageimg from "../../Assets/sing-up-logo.png";
import logo from "../../Assets/data.png";
// import "./singup-page.css";

function Enter_CC() {
    const [cc, setCC] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Here is the fetch call to your backend
        const response = await fetch(`http://localhost:5000/call-to-openai?cc=${cc}`);
        const data = await response.json();
    
        // Here you could handle the response from the server
        console.log(data);
      }
  return (
    <div className="main">
      <div className="left">
        <div className="login-container">
          <div className="logo">
            <img src={logo} alt="Parchaa-Cortex-IMG" />
          </div>
          <h1>Well Come to Parchaa Ai-Service</h1>
          <h4>Please enter your cc according to you</h4>
          <form className="input-grid" onSubmit={handleSubmit}>
        <input
          type="cc"
          name="cc"
          placeholder="Enter Chief Complaint"
          className="input1"
          value={cc}
          onChange={(event) => setCC(event.target.value)}
        />
            <input className="submit"
              type="submit"
              value="Sign Up"
              style={{
                width: "150px",
                height: "43px",
                backgroundColor: "#4B6AF5",
                color: "white",
                fontSize: "18px",
                borderRadius: "8px",
                
              }}
            />
          </form>
        </div>
      </div>

      <div className="right">
        <div className="parchaa-cortex-img">
          <img src={loginpageimg} />
        </div>
      </div>
      <div className="copyright">© Design By Varis. All Rights Reserved.</div>
    </div>
  );
}

export default Enter_CC;
