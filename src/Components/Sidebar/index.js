import React from 'react'
import { useNavigate } from 'react-router'
import "./sidebar.css"
import logo from "../../Assets/parchaa-ai-service.png"
function Sidebar() {
    const navigate  = useNavigate()
  return (
    <div className="sidebar-wrapper">
          <div className="logo-wrapper"> <img src={logo} alt="logo" className="logo"/> </div>
         <button onClick={()=> navigate("/before7level")} className="dashboard-btn">Before 7 Level</button>
         <button onClick={()=> navigate("/after7level")} className="dashboard-btn">After 7 Level</button>
        <button onClick={()=> navigate("/status")}  className="dashboard-btn">CC Status</button>
        <button onClick={()=> navigate("/datagenration")}  className="dashboard-btn">Data Upload</button>
    </div>
  )
}

export default Sidebar