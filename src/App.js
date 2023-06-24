import React from 'react';
import DecisionTree from './DecisionTree';
import data from './data.json';

function App() {
  return (
    <div className="App">
      <DecisionTree data={data} />
    </div>
  );
}

export default App;
