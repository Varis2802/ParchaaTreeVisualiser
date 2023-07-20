import React, { useState } from "react";
import loginpageimg from "../../Assets/loginPageAI.png";
import logo from "../../Assets/data.png";
import "./login-page.css";
import { useNavigate } from "react-router";

function LoginPage() {
  let navigate = useNavigate();

  // Declare state for login credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Static login credentials
  const staticUsername = 'admin';
  const staticPassword = '123456';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === staticUsername && password === staticPassword) {
      navigate('/symptomes-checker'); // Redirect to Instructions page
    } else {
      alert("Invalid credentials");
    }
  };
  

  return (
    <div className="main">
      <div className="left">
        <div className="login-container">
          <div className="logo">
            <img src={logo} alt="Parchaa-Cortex-IMG" />
          </div>
          <h1>Welcome back</h1>
          <h4>Please enter your details</h4>
          <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Login ID"
          className="input"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input"
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="submit"
          value="Login"
          style={{
            width: "299px",
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
        <div className="sing-up-btn" onClick={()=> {navigate("/singup")}}>Sign up</div>
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

export default LoginPage;
