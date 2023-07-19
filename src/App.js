import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DecisionTree from './DecisionTree';
import LoginPage from './login-page';
import SingupPage from './singup-page';
import Instructions from './Instructions'; // Import the Instructions component
import Enter_CC from './chief_complaint';
import Data_generation from './data-generation';

function App() {
  const [data, setData] = useState(null);

  const handleDataChange = async (value) => {
    try {
      const module = await import(`./${value}.json`);
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
        <Route path="/data-generation" element={<Data_generation/>}></Route>
        <Route path="/call-to-openai" element={<Enter_CC/>}></Route>
        <Route path="/instructions" element={<Instructions/>}></Route>
        <Route path="/parchaa-cortex" element={<DecisionTree data={data} onOptionChange={handleDataChange} />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
