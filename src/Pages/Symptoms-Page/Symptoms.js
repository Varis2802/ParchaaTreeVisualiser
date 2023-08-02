
import { useNavigate } from "react-router";
import { DataSet, Network } from "vis-network/standalone";
import "./symptomes-page.css";


import React, { useEffect } from "react";

function SymptomesChecker() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // create an array with nodes
    var nodes = new DataSet([
      {id: 1, label: 'Parchaa Cortex', title: 'Parchaa Cortex', color: {background: 'pink'}}, // root node with different color
      {id: 2, label: 'Data Generation', title: 'Data Generation'},
      {id: 3, label: 'Visualiser', title: 'Visualiser'},
      // Uncomment below if you need to add "Dashboard" button.
      // {id: 4, label: 'Dashboard', title: 'Dashboard'}
    ]);
  
    // create an array with edges
    var edges = new DataSet([
      {from: 1, to: 2}, // curved edges
      {from: 1, to: 3}, // curved edges
      
      // Uncomment below if you need to add "Dashboard" button.
      // {from: 1, to: 4}
    ]);
  
    // create a network
    var container = document.getElementById('network');
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      layout: {
        physics: false,
        hierarchical: {
          direction: "UD",
          sortMethod: "directed",
          levelSeparation: 350, // Adjust the distance between different levels of nodes
          nodeSpacing: 20 // Adjust the horizontal distance between sibling nodes
        }
      },
      edges: {
        smooth: {
          enabled: true,
          type: 'cubicBezier',
          forceDirection: 'vertical',
          roundness: 0.7
        },
        color: {
          color: "#2B7CE9",
          opacity: 0.8
        },
      },
      interaction: {
        hover: true
      },
      nodes: {
        shape: 'box',
        color: {
          hover: {
            border: 'red',
            background: 'pink'
          }
        }
      },
      edges: {
        smooth: {
          enabled: true,
          type: 'cubicBezier',
          forceDirection: 'vertical',
          roundness: 0.7
        },
        color: {
          color: "#2B7CE9",
          opacity: 0.8
        },
      },
    };
    
    
    // Rest of your code
    
    var network = new Network(container, data, options);
  
    network.on("click", function(params) {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        switch (nodeId) {
          case 2:
            navigate("/status");
            break;
          case 3:
            navigate("/instructions");
            break;
          // Uncomment below if you need to add "Dashboard" button.
          // case 4:
          //   navigate("/before7level");
          //   break;
        }
      }
    });
  
  }, [])
  

  return (
    <div className="symptomes-page-wrapper">
      <h1 className="heading">Parchaa Cortex</h1>
      <div id="network" style={{width: "800px", height: "600px"}}></div>
    </div>
  );
}

export default SymptomesChecker;