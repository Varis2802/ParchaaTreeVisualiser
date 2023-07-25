import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DecisionTree from './Pages/Decision-Tree/DecisionTree';
import LoginPage from './Pages/Login-Page/login-page';
import SingupPage from './Pages/Sign-up-Page/singup-page';
import Instructions from './Pages/Instruction/Instructions'; // Import the Instructions component
import Enter_CC from './Pages/Chief-complaints/chief_complaint';
import DataGeneration from './Pages/Dashboard Pages/Data-Genration/data-generation';
import SymptomesChecker from './Pages/Symptoms-Page/Symptoms';
import Status from './Pages/Dashboard Pages/Status';
import Befor7levelPage from './Pages/Dashboard Pages/Befor7level-page';
import DataUploadDB from './Pages/Dashboard Pages/data-upload-db';
// import Dashboard from './Pages/Dashboard';


function App() {
  const [data, setData] = useState(null);

  const handleDataChange = async (value) => {
    try {
      const module = await import(`./Json-files/${value}.json`);
      setData(module.default || module);
    } catch (err) {
      console.error(`Failed to load ${value}.json file`, err);
    }
  };

  return (
    <BrowserRouter>
     <Routes>
        <Route index path="/" element={<LoginPage/>}></Route>
        <Route path="/singup" element={<SingupPage/>}></Route>
        <Route path="/symptomes-checker" element={<SymptomesChecker/>}></Route>
        <Route path="/after7level" element={<DataGeneration/>}></Route>
        <Route path="/call-to-openai" element={<Enter_CC/>}></Route>
        <Route path="/instructions" element={<Instructions/>}></Route>
        <Route path="/parchaa-cortex" element={<DecisionTree data={data} onOptionChange={handleDataChange} />}></Route>
        <Route path="/status" element={<Status/>}></Route>
        <Route path="/before7level" element={<Befor7levelPage/>}></Route>
        <Route path="/data-upload" element={<DataUploadDB/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
