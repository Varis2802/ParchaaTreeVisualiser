import React, { useState, useEffect, useRef, useCallback } from "react";
import './DecisionTree.css';
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import axios from 'axios';

cytoscape.use(dagre);

function DecisionTree({ data }) {
  const cyRef = useRef(null);
  const [editingNode, setEditingNode] = useState(null);
  const [editingEdge, setEditingEdge] = useState(null);
  const [formPosition, setFormPosition] = useState({ x: 0, y: 0 });
  const [inputText, setInputText] = useState("");
  
  const [addingNode, setAddingNode] = useState(false);
  const [removingNode, setRemovingNode] = useState(false);
  const [addingEdge, setAddingEdge] = useState(false);
  const [removingEdge, setRemovingEdge] = useState(false);
  const [cy, setCy] = useState(null);
  
  const [, setDfsStartingNode] = useState(null);

  const onDFS = () => {
    const startId = prompt("Enter the start node id:");
    const dfsResults = cy.elements().depthFirstSearch({
      root: `#${startId}`,
      visit: function(v, e, u, i, depth) {
        console.log(`Visited node ${v.id()}`);
        if (e) {
          setTimeout(() => {
            e.animate({
              style: {
                'line-color': '#c17d11',
                'color': 'blue' // highlight edge text
              },
              duration: 2000 // transition duration
            });
          }, i * 500);
        }
      },
      directed: false
    });
    const pathNodes = dfsResults.path.nodes();
    pathNodes.forEach((node, i) => {
      setTimeout(() => {
        node.animate({
          style: {
            'background-color': '#c17d11',
            'color': 'blue' // highlight node text
          },
          duration: 2000 // transition duration
        });
        // Adjust view to current node
        cy.fit(node, 50); // fit view to current node with 50px padding
        cy.zoom({ level: 1.5 }); // zoom in
        cy.center(node); // center view to current node
      }, i * 500); // Change color and view every 500ms
    });
  };

  const onBFS = () => {
    const startId = prompt("Enter the start node id:");
    const bfsResults = cy.elements().breadthFirstSearch({
      root: `#${startId}`,
      visit: function(v, e, u, i, depth) {
        console.log(`Visited node ${v.id()}`);
        if (e) {
          setTimeout(() => {
            e.animate({
              style: {
                'line-color': '#c17d11',
                'color': 'blue' // highlight edge text
              },
              duration: 2000 // transition duration
            });
          }, i * 500);
        }
      },
      directed: false
    });
    const pathNodes = bfsResults.path.nodes();
    pathNodes.forEach((node, i) => {
      setTimeout(() => {
        node.animate({
          style: {
            'background-color': '#c17d11',
            'color': 'blue' // highlight node text
          },
          duration: 2000 // transition duration
        });
        // Adjust view to current node
        cy.fit(node, 50); // fit view to current node with 50px padding
        cy.zoom({ level: 1.5 }); // zoom in
        cy.center(node); // center view to current node
      }, i * 500); // Change color and view every 500ms
    });
  };


  
  const saveGraphState = async () => {
    const cytoscapeData = cy.json().elements;  // Get the current state of the graph
    try {
      // Make POST request to the backend
      const response = await axios.post('http://localhost:4000/connect-react/update-json', cytoscapeData);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };
  
  const onAddNode = async () => {
    const id = prompt("Enter node id:");
    const label = prompt("Enter node label:");
    cy.add({
      group: "nodes",
      data: { id, label },
    });
    await saveGraphState();
  };
  
  const onRemoveNode = async () => {
    const id = prompt("Enter node id to remove:");
    const nodeToRemove = cy.$id(id);
    cy.remove(nodeToRemove);
    await saveGraphState();
  };
  
  const onAddEdge = async () => {
    const sourceId = prompt("Enter source node id:");
    const targetId = prompt("Enter target node id:");
    const label = prompt("Enter edge label:");
    cy.add({
      group: "edges",
      data: { id: `${sourceId}-${targetId}`, source: sourceId, target: targetId, label },
    });
    await saveGraphState();
  };
  
  const onRemoveEdge = async () => {
    const sourceId = prompt("Enter source node id:");
    const targetId = prompt("Enter target node id:");
    const edgeToRemove = cy.edges(`[source = "${sourceId}"][target = "${targetId}"]`);
    cy.remove(edgeToRemove);
    await saveGraphState();
  };
  
  const onRemoveSelectedNode = async () => {
    if (removingNode) {
      cy.remove(removingNode);
      setRemovingNode(null);
      await saveGraphState();
    }
  };
  
  const onRemoveSelectedEdge = async () => {
    if (removingEdge) {
      cy.remove(removingEdge);
      setRemovingEdge(null);
      await saveGraphState();
    }
  };
  
  const handleNodeClick = useCallback((evt) => {
    const node = evt.target;
    const transitionDuration = 500; // 500ms transition duration, you can adjust this value
  
    if (node.data('collapsed')) { // If the node is collapsed, expand only immediate children
      node.outgoers('node').animate({
        style: { 'opacity': 1 },
        duration: transitionDuration
      });
      node.connectedEdges().animate({
        style: { 'opacity': 1 },
        duration: transitionDuration
      });
      node.data('collapsed', false);
      // Create new layout
    //   const layout = node.cy().layout({
    //     name: 'dagre',
    //     roots: node,
    //     spacingFactor: 1.0, // Adjust as necessary to set the overall layout size
    //     nodeSpacing: 50, // Increase to add more spacing between nodes
    //   });
    //   layout.run(); // Run the layout
    } else { // If the node is expanded, collapse all descendants
      const descendants = getDescendants(node);
      descendants.nodes.forEach(node => node.animate({
        style: { 'opacity': 0 },
        duration: transitionDuration
      }));
      descendants.edges.forEach(edge => edge.animate({
        style: { 'opacity': 0 },
        duration: transitionDuration
      }));
      node.data('collapsed', true);
    }
  }, []);
  
   
 // Helper function to get all descendants of a node
const getDescendants = (node) => {
    const descendants = {
      nodes: [],
      edges: []
    };
    const stack = [...node.outgoers('node')]; // Start with immediate children
    while(stack.length) {
      const currentNode = stack.pop();
      const children = currentNode.outgoers('node');
      descendants.nodes.push(currentNode); // Only push the current node
      descendants.edges.push(...currentNode.connectedEdges());
      stack.push(...children);
    }
    return descendants;
  };
  
  
  
  useEffect(() => {
    if (!cyRef.current) return;

    const elements = generateCytoscapeElements(data);

    const cyInstance = cytoscape({
      container: cyRef.current,
      elements: elements,
      style: [
        // Node style
        {
          selector: "node",
          style: {
            "background-color": "#8eecf5",
            "border-width": 1,
            "border-color": "yellow",
            shape: "rectangle",
            "shape-polygon-points":"none",
            "text-wrap": "wrap",
            "text-valign": "center",
            content: "data(label)",
            color: "#304455",
            "font-size": "12px",
            "font-weight": "bold",
            "text-width-padding": "10px",
            "text-height-padding": "10px",
            width: "label",
            height: "30",
          },
        },
        // Edge style
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#ff82a9",
            "curve-style": "taxi", // Use the unbundled-bezier curve style
            "target-arrow-color": "#116D6E",
            "target-arrow-shape": "vee",
            "arrow-scale": 2,
            label: "data(label)",
            "text-rotation": "outline",
            "font-size": "15px",
            "font-weight": "bold",
        "font-family":"Comic Sans MS",
        "font-color":"#241E92"
          },
        },
        {
            selector: 'node[id = "root"]', // assuming 'root' is the id of root node
            style: {
              "background-color": "green", // set your desired color here
            },
          },
      ],
      layout: {
        name: "dagre",
        rankDir: "TD",
        rankSep: 1000, // increase this value for more vertical space between nodes
        edgeLength: 800,
      },      
      
    });
    setCy(cyInstance);
    
    // Register event handlers
    cyInstance.on("taphold", "node", function (evt) {
      const node = evt.target;
      setFormPosition(node.renderedPosition());
      setInputText(node.data("label"));
      setEditingNode(node);
    });

    cyInstance.on("taphold", "edge", function (evt) {
      const edge = evt.target;
      setFormPosition(edge.source().renderedPosition());
      setInputText(edge.data("label"));
      setEditingEdge(edge);
    });
    cyInstance.on("tap", "node", handleNodeClick); // Register new click handler for nodes
    
    cyInstance.on('select', 'node', function(evt){
        const node = evt.target;
        setRemovingNode(node);
        setDfsStartingNode(node);
      });
  
      cyInstance.on('select', 'edge', function(evt){
        const edge = evt.target;
        setRemovingEdge(edge);
      });
  
      
    }, [cyRef, data, handleNodeClick]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (editingNode) {
      editingNode.data("label", inputText);
    } else if (editingEdge) {
      editingEdge.data("label", inputText);
    }
    setInputText("");
    setEditingNode(null);
    setEditingEdge(null);
  
    const cytoscapeData = cy.json().elements;  // Get the current state of the graph
    try {
      // Make POST request to the backend
      const response = await axios.post('http://localhost:4000/connect-react/update-json', cytoscapeData);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };
  

  return (
    <div>
     <div className="button-container" style={{ position: "relative", zIndex: 2 }}>
  {addingNode ? (
    <button onClick={onAddNode}>Submit Node</button>
  ) : (
    <button onClick={() => setAddingNode(true)}>Add Node</button>
  )}
  {removingNode ? (
    <button onClick={onRemoveNode}>Submit Remove Node</button>
  ) : (
    <button onClick={() => setRemovingNode(true)}>Remove Node</button>
  )}
  {addingEdge ? (
    <button onClick={onAddEdge}>Submit Edge</button>
  ) : (
    <button onClick={() => setAddingEdge(true)}>Add Edge</button>
  )}
  {removingEdge ? (
    <button onClick={onRemoveEdge}>Submit Remove Edge</button>
  ) : (
    <button onClick={() => setRemovingEdge(true)}>Remove Edge</button>
  )}
    <button onClick={onRemoveSelectedNode}>Remove Selected Node</button>
        <button onClick={onRemoveSelectedEdge}>Remove Selected Edge</button>
        <h1 className="heading">HEADACHE</h1>
        <button className="dfs" onClick={onDFS}>D-F-S</button>
        <button className="bfs" onClick={onBFS}>B-F-S</button>
</div>




<div style={{ position: "relative", height: "1000px", width: "100%" }}> 
        <div ref={cyRef} style={{ width: "100%", height: "90vh" }} />
        {(editingNode || editingEdge) && (
          <form
            style={{
              position: "absolute",
              top: formPosition.y,
              left: formPosition.x,
            }}
            onSubmit={onSubmit}
          >
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit">Save</button>
          </form>
        )}
      </div>
    </div>
  );
}
function generateCytoscapeElements(data) {
    const nodes = [];
    const edges = [];
    const nodeIds = new Set();
  
    data.forEach((item) => {
      // If item is a diagnosis, set label to first diagnosis text in options
      const label = item.is_diagnoisis 
        ? Object.values(item.options)[0].join(', ') 
        : item.question;
  
      nodes.push({
        data: {
          id: item.queid,
          label: label,
          parent: item.parentId,
          collapsed: item.queid === 'root' ? false : true, // assuming 'root' is the id of root node
          _children: [], // initialize _children with an empty array
        },
      });
      nodeIds.add(item.queid);
    });
  
    data.forEach((item) => {
      if (item.options && !item.is_diagnoisis) { // Only create edges if options are present and it's not a diagnosis
        Object.entries(item.options).forEach(([option, target]) => {
          if (!nodeIds.has(target)) {
            console.warn(
              `Skipping edge from ${item.queid} to non-existent target ${target}`
            );
            return;
          }
          edges.push({
            data: {
              id: `${item.queid}${target}`,
              source: item.queid,
              target,
              label: option,
            },
          });
          nodes.find(node => node.data.id === item.queid).data._children.push(target); // add child to parent node's _children
        });
      }
    });
  
    return [...nodes, ...edges];
  }
  
  
export default DecisionTree;
