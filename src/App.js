import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DecisionTree from './DecisionTree';
import data from './data.json';
import LoginPage from './login-page';
import SingupPage from './singup-page';

function App() {
  return (
    <BrowserRouter>
      {/* <div className="App"> */}
        <Routes>
          <Route index path="/" element={<LoginPage/>}></Route>
          <Route index path="/singup" element={<SingupPage/>}></Route>
          <Route path="/parchaa-cortex" element ={<DecisionTree data={data} />}></Route>
          
        </Routes>
      {/* </div> */}
    </BrowserRouter>
  );
}

export default App;
