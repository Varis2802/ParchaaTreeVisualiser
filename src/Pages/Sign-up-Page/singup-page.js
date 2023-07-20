import React from "react";
import loginpageimg from "../../Assets/sing-up-logo.png";
import logo from "../../Assets/data.png";
import "./singup-page.css";

function SingupPage() {
  return (
    <div className="main">
      <div className="left">
        <div className="login-container">
          <div className="logo">
            <img src={logo} alt="Parchaa-Cortex-IMG" />
          </div>
          <h1>Welcome back</h1>
          <h4>Please enter your details</h4>
          <form className="input-grid">
            <input
              type="text"
              name="first name"
              placeholder="First Name"
              className="input1"
            />
            <input
              type="text"
              name="last name"
              placeholder="Last Name"
              className="input1"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input1"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input1"
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
          <div className="line-section">
          <div className="line1"></div>
          <div className="or">or</div>
          <div className="line2"></div>
        </div>
        <div className="sing-up-btn">Log In</div>
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

export default SingupPage;
