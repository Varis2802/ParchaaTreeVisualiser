import React from 'react'
import { useNavigate } from 'react-router'
import "./sidebar.css"
import logo from "../../Assets/parchaa-ai-service.png"
function Sidebar() {
    const navigate  = useNavigate()
  return (
    <div className="sidebar-wrapper">
          <div className="logo-wrapper"> <img src={logo} alt="logo" className="logo-1"/> </div>
         <button onClick={()=> navigate("/before7level")} className="dashboard-btn">Intial Level</button>
         <button onClick={()=> navigate("/after7level")} className="dashboard-btn">Final Level</button>
        <button onClick={()=> navigate("/status")}  className="dashboard-btn">CC Status</button>
        <button onClick={()=> navigate("/data-upload")}  className="dashboard-btn">Data Upload To DB</button>
    </div>
  )
}

export default Sidebar
