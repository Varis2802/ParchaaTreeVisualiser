import React, { useState, useEffect, useRef, useCallback } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import undoRedo from "cytoscape-undo-redo";
import axios from "axios";
import "./DecisionTree.css";
import logo from "../../Assets/data.png"; // Adjust path as needed
import panzoom from "cytoscape-panzoom";
import "cytoscape-panzoom/cytoscape.js-panzoom.css";
import Select from "react-select";
import daddu from "../../Assets/daddu.png";
import euler from "cytoscape-euler";
import spread from "cytoscape-spread";
import Autosuggest from "react-autosuggest";
// Register the spread layout extension
cytoscape.use(spread);

cytoscape.use(dagre);
cytoscape.use(euler);
cytoscape.use(undoRedo); // Register undoRedo extension
// don't forget to register the extension
cytoscape.use(panzoom);

const options = [
  { value: "urination", label: "reduce urination" },
  { value: "data", label: "Chest Pain" },
  { value: "facePain", label: "Face Pain" },
  { value: "headache", label: "Headache" },
  { value: "cough", label: "Cough" },
  { value: "data", label: "Back Pain" },

  // ...other options
];

let pathIndex = 0; // index to keep track of current path
let rootToLeafPaths = []; // array to store all root-to-leaf paths
const allLeafNodes = []; // Define allLeafNodes as a global array

function DecisionTree({ data, onOptionChange }) {
  //get file from django
  // const [fileContent, setFileContent] = useState('');

  // useEffect(() => {
  //   axios.get('http://127.0.0.1:8000/datagens')
  //     .then(response => {
  //       setFileContent(response.data);
  //     })
  //     .catch(error => {
  //       console.error('There was an error!', error);
  //     });
  // }, []);
  //for Qid search
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [leafNodes, setLeafNodes] = useState(allLeafNodes);

  // Remove duplicates from allLeafNodes array
  const uniqueLeafNodes = Array.from(new Set(allLeafNodes));

  // Update the state with uniqueLeafNodes
  useEffect(() => {
    setLeafNodes(uniqueLeafNodes);
  }, [uniqueLeafNodes]);

  const [showLeafNodes, setShowLeafNodes] = useState(false); // Whether to show the leaf node list

  const [ur, setUr] = useState(null);
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

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  let highlightedNodes = []; // Keep track of previously highlighted nodes
  let highlightedEdges = []; // Keep track of previously highlighted edges

  // Initialize pathCount state
  const [pathCount, setPathCount] = useState(1);
  const [totalCount, setTotalCount] = useState(1);

  const inputRef = useRef(null);
  //for input editng part
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${getTextWidth(inputText)}px`;
    }
  }, [inputText]);

  const onSearch = () => {
    // Hide all nodes
    cy.elements().hide();

    // Find nodes that contain the search text
    const matchingNodes = cy.nodes().filter((node) => {
      const label = node.data("label");
      if (label && typeof label === "string") {
        return label.toLowerCase().includes(searchText.toLowerCase());
      }
      return false;
    });

    // Filter for leaf nodes (nodes with no successors)
    const matchingLeafNodes = matchingNodes.filter(
      (node) => node.successors().length === 0
    );

    // Show the matching leaf nodes
    matchingLeafNodes.show();

    // Show and highlight the path to the root for each matching leaf node
    matchingLeafNodes.forEach((node) => {
      const predecessors = node.predecessors();
      predecessors.show(); // Show predecessors of matching nodes
      rootToLeafPaths.push(predecessors); // Store the path in the array
    });

    // Adjust positions of visible nodes using hierarchical layout
    const layout = cy.elements(":visible").layout({
      name: "dagre",
      rankDir: "TD",
      rankSep: 40,
      nodeSep: 10,
      edgeSep: 30,
    });
    // In the onNext function, after layout.run():
    layout.on("layoutstop", () => {
      const nodes = cy.nodes(":visible"); // get only visible nodes
      nodes.forEach((node, index) => {
        const newPosition = {
          x: node.position("x") + (index + 1) * 2, // adjust as necessary
          y: node.position("y") + (index + 1) * 2, // adjust as necessary
        };
        node.position(newPosition);
      });
    });

    layout.run();

    highlightPathToRoot1(rootToLeafPaths[0]);
  };

  const onNext = () => {
    // Hide all nodes and edges
    cy.elements().hide();

    // Increment pathIndex and loop back to 0 if it exceeds the array length
    pathIndex = (pathIndex + 1) % rootToLeafPaths.length;
    // Update pathCount state after updating pathIndex
    setPathCount(pathIndex);
    setTotalCount(rootToLeafPaths.length);
    // Check if the current path is defined
    if (!rootToLeafPaths[pathIndex]) {
      console.error("No paths available.");
      return;
    }

    // Show the current path nodes and their predecessors
    const currentPath = rootToLeafPaths[pathIndex];
    const connectedNodes = currentPath.connectedNodes(); // Get connected nodes, including the node itself
    connectedNodes.show();

    // Show the edges connecting the nodes in the current path
    connectedNodes.connectedEdges().show();

    // Find leaf nodes that follow the current path
    const leafNodes = connectedNodes.filter(
      (node) => node.successors().length === 0
    );
    leafNodes.show();

    // Highlight the current path
    highlightPathToRoot1(currentPath);

    // Rerun the layout
    const layout = cy.elements(":visible").layout({
      name: "dagre",
      rankDir: "TD",
      rankSep: 50,
      nodeSep: 20,
      edgeSep: 30,
    });

    // In the onNext function, after layout.run():
    layout.on("layoutstop", () => {
      const nodes = cy.nodes(":visible"); // get only visible nodes
      nodes.forEach((node, index) => {
        const newPosition = {
          x: node.position("x") + (index + 1) * 2, // adjust as necessary
          y: node.position("y") + (index + 1) * 2, // adjust as necessary
        };
        node.position(newPosition);
      });
    });

    layout.run();
  };

  const onPrev = () => {
    // Hide all nodes and edges
    cy.elements().hide();

    // Decrement pathIndex and if it falls below 0 then set it to the last index
    pathIndex = pathIndex - 1 < 0 ? rootToLeafPaths.length - 1 : pathIndex - 1;
    // Update pathCount state after updating pathIndex
    setPathCount(pathIndex);
    setTotalCount(rootToLeafPaths.length);
    // Check if the current path is defined
    if (!rootToLeafPaths[pathIndex]) {
      console.error("No paths available.");
      return;
    }

    // Show the current path nodes and their predecessors
    const currentPath = rootToLeafPaths[pathIndex];
    const connectedNodes = currentPath.connectedNodes(); // Get connected nodes, including the node itself
    connectedNodes.show();

    // Show the edges connecting the nodes in the current path
    connectedNodes.connectedEdges().show();

    // Find leaf nodes that follow the current path
    const leafNodes = connectedNodes.filter(
      (node) => node.successors().length === 0
    );
    leafNodes.show();

    // Highlight the previous path
    highlightPathToRoot1(currentPath);

    // Adjust positions of visible nodes using hierarchical layout
    // Rerun the layout
    const layout = cy.elements(":visible").layout({
      name: "dagre",
      rankDir: "TD",
      rankSep: 40, // Decreased from 80 to 40
      nodeSep: 10,
      edgeSep: 30,
    });

    // In the onNext function, after layout.run():
    layout.on("layoutstop", () => {
      const nodes = cy.nodes(":visible"); // get only visible nodes
      nodes.forEach((node, index) => {
        const newPosition = {
          x: node.position("x") + (index + 1) * 2, // adjust as necessary
          y: node.position("y") + (index + 1) * 2, // adjust as necessary
        };
        node.position(newPosition);
      });
    });

    layout.run();
  };

  const highlightPathToRoot1 = (node) => {
    // Remove highlight from previous path
    highlightedNodes.forEach((highlightedNode) => {
      highlightedNode.animate({
        style: {
          "background-color": "#4A68F1",
          color: "black", // revert to original node text color
        },
      });
    });

    highlightedEdges.forEach((highlightedEdge) => {
      highlightedEdge.animate({
        style: {
          "line-color": "black",
          color: "black", // revert to original edge text color
        },
      });
    });

    highlightedNodes = [];
    highlightedEdges = [];

    // Highlight new path
    const predecessors = node.predecessors();
    const nodes = predecessors.nodes();
    const edges = predecessors.edges();

    nodes.forEach((node, i) => {
      setTimeout(() => {
        node.animate({
          style: {
            "background-color":
              node.successors().length === 0 ? "#4A68F1" : "#4A68F1", // Highlight leaf nodes with a different color
            color: "white", // highlight node text
          },
        });

        highlightedNodes.push(node); // Add node to highlightedNodes array

        // Adjust view to current node
        cy.fit(node, 5000000); // fit view to current node with 50px padding
        cy.zoom({ level: 1 }); // zoom in
        cy.center(node); // center view to current node
      }, i * 5); // Change color and view every 500ms
    });

    edges.forEach((edge, i) => {
      setTimeout(() => {
        edge.animate({
          style: {
            "line-color": "black",
            color: "black", // highlight edge text
          },
        });

        highlightedEdges.push(edge); // Add edge to highlightedEdges array
      }, i * 5); // Change color every 500ms
    });

    // Highlight the leaf node (target of the search) with a different color
    if (node.successors().length === 0) {
      node.animate({
        style: {
          "background-color": "#15cb79", // change to the color you want for the leaf node
          color: "white", // change text color as needed
        },
      });
    }
  };

  const highlightPathToRoot = (node) => {
    // Remove highlight from previous path
    highlightedNodes.forEach((highlightedNode) => {
      highlightedNode.animate({
        style: {
          "background-color": "#4A68F1",
          color: "black", // revert to original node text color
        },
        duration: 2000, // transition duration
      });
    });

    highlightedEdges.forEach((highlightedEdge) => {
      highlightedEdge.animate({
        style: {
          "line-color": "black",
          color: "black", // revert to original edge text color
        },
        duration: 2000, // transition duration
      });
    });

    highlightedNodes = [];
    highlightedEdges = [];

    // Hide all elements
    cy.elements().style("display", "none");

    // Highlight new path
    const predecessors = node.predecessors();
    const nodes = predecessors.nodes();
    const edges = predecessors.edges();

    nodes.forEach((node, i) => {
      setTimeout(() => {
        node.animate({
          style: {
            "background-color": "#4A68F1",
            color: "#FFF;", // highlight node text
          },
          duration: 2000, // transition duration
        });

        highlightedNodes.push(node); // Add node to highlightedNodes array

        // Show the highlighted node
        node.style("display", "element");

        // Adjust view to current node
        cy.fit(node, 5000000); // fit view to current node with 50px padding
        cy.zoom({ level: 1.9 }); // zoom in
        cy.center(node); // center view to current node
      }, i * 500); // Change color and view every 500ms
    });

    edges.forEach((edge, i) => {
      setTimeout(() => {
        edge.animate({
          style: {
            "line-color": "black",
            color: "white", // highlight edge text
          },
          duration: 2000, // transition duration
        });

        highlightedEdges.push(edge); // Add edge to highlightedEdges array

        // Show the highlighted edge
        edge.style("display", "element");
      }, i * 500); // Change color every 500ms
    });

    // Highlight the leaf node (target of the search) with a different color
    node.animate({
      style: {
        "background-color": "#4A68F1", // change to the color you want for the leaf node
        color: "white", // change text color as needed
      },
      duration: 2000, // transition duration
    });

    highlightedNodes.push(node); // Add node to highlightedNodes array

    // Show the highlighted leaf node
    node.style("display", "element");
  };

  const onDFS = () => {
    const startId = prompt("Enter the start node id:");
    const dfsResults = cy.elements().depthFirstSearch({
      root: `#${startId}`,
      visit: function (v, e, u, i, depth) {
        console.log(`Visited node ${v.id()}`);
        if (e) {
          setTimeout(() => {
            e.animate({
              style: {
                "line-color": "#FF3E6D",
                color: "black", // highlight edge text
              },
              duration: 2000, // transition duration
            });
          }, i * 500);
        }
      },
      directed: false,
    });
    const pathNodes = dfsResults.path.nodes();
    pathNodes.forEach((node, i) => {
      setTimeout(() => {
        node.animate({
          style: {
            "background-color": "#F1FFAB",
            color: "black", // highlight node text
          },
          duration: 2000, // transition duration
        });
        // Adjust view to current node
        cy.fit(node, 50); // fit view to current node with 50px padding
        cy.zoom({ level: 1.9 }); // zoom in
        cy.center(node); // center view to current node
      }, i * 500); // Change color and view every 500ms
    });
  };

  const onBFS = () => {
    const startId = prompt("Enter the start node id:");
    const bfsResults = cy.elements().breadthFirstSearch({
      root: `#${startId}`,
      visit: function (v, e, u, i, depth) {
        console.log(`Visited node ${v.id()}`);
        if (e) {
          setTimeout(() => {
            e.animate({
              style: {
                "line-color": "#FF3E6D",
                color: "black", // highlight edge text
              },
              duration: 2000, // transition duration
            });
          }, i * 1000);
        }
      },
      directed: false,
    });
    const pathNodes = bfsResults.path.nodes();
    pathNodes.forEach((node, i) => {
      setTimeout(() => {
        node.animate({
          style: {
            "background-color": "#F1FFAB",
            color: "black", // highlight node text
          },
          duration: 2000, // transition duration
        });
        // Adjust view to current node
        cy.fit(node, 50); // fit view to current node with 50px padding
        cy.zoom({ level: 1.5 }); // zoom in
        cy.center(node); // center view to current node
      }, i * 1000); // Change color and view every 500ms
    });
  };

  const saveGraphState = async () => {
    const cytoscapeData = cy.json().elements; // Get the current state of the graph
    try {
      // Make POST request to the backend
      const response = await axios.post(
        "http://localhost:4000/connect-react/update-json",
        {
          data: cytoscapeData,
          complaint: selectedComplaint, // Send the selected complaint
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const onAddNode = async () => {
    const id = prompt("Enter node id:");
    const label = prompt("Enter node label:");

    // Get the position of the root node
    const rootPosition = cy.$("Q1").position();

    // Calculate the position for the new node based on the root node's position
    const newNodePosition = {
      x: rootPosition.x - 500,
      y: rootPosition.y + 500,
    };

    // Use ur.do() to perform an undoable action
    ur.do("add", {
      group: "nodes",
      data: { id, label },
      position: newNodePosition,
    });

    await saveGraphState();
  };

  const onRemoveNode = async () => {
    const id = prompt("Enter node id to remove:");
    const nodeToRemove = cy.$id(id);
    // Use ur.do() to perform an undoable action
    ur.do("remove", nodeToRemove);
    await saveGraphState();
  };

  const onAddEdge = async () => {
    const sourceId = prompt("Enter source node id:");
    const targetId = prompt("Enter target node id:");
    const label = prompt("Enter edge label:");

    ur.do("add", {
      group: "edges",
      data: {
        id: `${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        label,
      },
    });

    await saveGraphState();
  };

  const onRemoveEdge = async () => {
    const sourceId = prompt("Enter source node id:");
    const targetId = prompt("Enter target node id:");
    const edgeToRemove = cy.edges(
      `[source = "${sourceId}"][target = "${targetId}"]`
    );

    ur.do("remove", edgeToRemove);
    await saveGraphState();
  };

  const onRemoveSelectedNode = async () => {
    if (removingNode) {
      ur.do("remove", removingNode);
      setRemovingNode(null);
      await saveGraphState();
    }
  };

  const onRemoveSelectedEdge = async () => {
    if (removingEdge) {
      ur.do("remove", removingEdge);
      setRemovingEdge(null);
      await saveGraphState();
    }
  };

  const handleNodeClick = useCallback((evt) => {
    const node = evt.target;
    const transitionDuration = 500; // 500ms transition duration, you can adjust this value

    if (node.data("collapsed")) {
      // If the node is collapsed, expand only immediate children
      const children = node.outgoers("node");

      children.forEach((child, index) => {
        const newPosition = {
          x: node.position("x") + (index + 1) * 100, // position new node 100px to the right for each index
          y: node.position("y") + (index + 1) * 100, // position new node 100px down for each index
        };

        child.position(newPosition);
        child.animate({
          style: { opacity: 1 },
          duration: transitionDuration,
        });
      });

      node.connectedEdges().animate({
        style: { opacity: 1 },
        duration: transitionDuration,
      });

      node.data("collapsed", false);
    } else {
      const descendants = getDescendants(node);
      descendants.nodes.forEach((node) =>
        node.animate({
          style: { opacity: 0 },
          duration: transitionDuration,
        })
      );
      descendants.edges.forEach((edge) =>
        edge.animate({
          style: { opacity: 0 },
          duration: transitionDuration,
        })
      );
      node.data("collapsed", true);
    }
  }, []);

  // Helper function to get all descendants of a node
  const getDescendants = (node) => {
    const descendants = {
      nodes: [],
      edges: [],
    };
    const stack = [...node.outgoers("node")]; // Start with immediate children
    while (stack.length) {
      const currentNode = stack.pop();
      const children = currentNode.outgoers("node");
      descendants.nodes.push(currentNode); // Only push the current node
      descendants.edges.push(...currentNode.connectedEdges());
      stack.push(...children);
    }
    return descendants;
  };
  // eslint-disable-next-line
  useEffect(() => {
    if (!cyRef.current) return;

    const elements = generateCytoscapeElements(data);

    const cyInstance = cytoscape({
      container: cyRef.current,
      elements: elements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#4A68F1",
            "border-width": 2,
            "padding-left": 10,
            "border-color": "#4A68F1",
            shape: "round-rectangle",
            "shape-polygon-points": "none",
            "text-wrap": "wrap",
            "text-valign": "center",
            content: "data(label)",
            color: "white",
            "font-size": "12px",
            "font-weight": "bold",
            "text-width-padding": "10px",
            "text-height-padding": "10px",
            width: "label",
            height: "30",
          },
        },

        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "black",
            "curve-style": "taxi", //unbundled-bezier,
            "target-arrow-color": "black",
            "target-arrow-shape": "vee",
            "arrow-scale": 2,
            label: "data(label)",
            "text-rotation": "outline",
            "text-outline-color": "white",
            "text-outline-width": 3, // Optional: specify outline width
            "font-size": "15px",
            "font-weight": "bold",
            "font-family": "Comic Sans MS",
            color: "black",
          },
        },
        {
          selector: 'node[id = "Q1"]', // assuming 'root' is the id of root node
          style: {
            "background-color": "#53B88B", // set your desired color here
            "border-color": "#53B88B",
            color: "white",
          },
        },
      ],

      layout: {
        name: "dagre",
        rankDir: "TD",
        rankSep: 300, // increase this value for more vertical space between nodes
        nodeSep: 10, // increase this value for more horizontal space between nodes
        edgeSep: 80, // distance between nodes and their edges
      },

      zoomingEnabled: true, // enable zooming
      userZoomingEnabled: true, // enable user zooming
      panningEnabled: true, // enable panning
      userPanningEnabled: true, // enable user panning
    });
    // After registering event handlers and other setup, add the following lines:
    // Initialize undoRedo extension
    const urInstance = cyInstance.undoRedo();
    setUr(urInstance);
    // Assuming your root node has id 'root'
    const rootNode = cyInstance.$id("Q1");
    if (rootNode) {
      cyInstance.fit(rootNode, 50); // fit view to root node with 50px padding
      cyInstance.zoom({ level: 0.4 }); // zoom in
      cyInstance.center(rootNode); // center view to root node
    }
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
    cyInstance.on("cxttap", "node", handleNodeClick); // Register new click handler for nodes

    cyInstance.on("select", "node", function (evt) {
      const node = evt.target;
      setRemovingNode(node);
      setDfsStartingNode(node);
    });

    cyInstance.on("select", "edge", function (evt) {
      const edge = evt.target;
      setRemovingEdge(edge);
    });
    cyInstance.on("select", "edge", function (evt) {
      const edge = evt.target;
      edge.style({
        "line-color": "red", // or any color you want
      });
    });

    //hover Qid
    // Register event handlers
    cyInstance.on("mouseover", "node", function (evt) {
      const node = evt.target;
      let tooltip = document.getElementById("tooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.setAttribute("id", "tooltip");
        document.body.appendChild(tooltip);
      }
      tooltip.style.display = "block";
      tooltip.style.left = evt.renderedPosition.x + "px";
      tooltip.style.top = evt.renderedPosition.y + "px";
      tooltip.innerHTML = `QuestionID: ${node.data("id")}`;
    });

    cyInstance.on("mouseout", "node", function () {
      const tooltip = document.getElementById("tooltip");
      if (tooltip) {
        tooltip.style.display = "none";
      }
    });

    cyInstance.on("dblclick", "node", function (evt) {
      const node = evt.target;
      highlightPathToRoot(node);
    });

    // Initialize panzoom extension
    cyInstance.panzoom({
      // Set position and size of zoom control
      zoomerPosition: "bottom-right", // Default is 'top-left'
      zoomerSize: 150, // Default is 75
    });
  }, [cyRef, data, handleNodeClick]);
  // Create an instance of undoRedo

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

    const cytoscapeData = JSON.stringify(cy.json().elements); // Get the current state of the graph
    try {
      // Make POST request to the backend
      const response = await axios.post(
        "http://localhost:4000/connect-react/update-json",
        {
          data: cytoscapeData,
          complaint: selectedComplaint, // Send the selected complaint
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // Add undo and redo methods
  const onUndo = () => ur.undo();
  const onRedo = () => ur.redo();

  const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: state.isSelected ? "#4A68F1" : "#4A68F1",
      backgroundColor: state.isSelected ? "#EFF1FF" : "#EFF1FF",
    }),

    control: (defaultStyles) => ({
      ...defaultStyles,
      width: " 100%",
      height: "100%",
      border: "none",
      boxShadow: "none",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#4A68F1" }),

    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#4A68F1", // Add the color you want for placeholder here.
      };
    },
    indicatorSeparator: (defaultStyles) => ({
      ...defaultStyles,
      backgroundColor: "red", // Change color here
      display: "none",
    }),
    dropdownIndicator: (defaultStyles) => ({
      ...defaultStyles,
      color: "#4A68F1",
    }),
  };
  const handleChange = (selectedOption) => {
    setSelectedComplaint(selectedOption.value); // Use the label instead of the value
    onOptionChange(selectedOption.value);
  };

  const handleSearchBoxClick = () => {
    setShowLeafNodes(true);
  };

  // When a leaf node is selected from the list, update searchText and hide the list
  const handleLeafNodeSelect = (nodeText) => {
    setSearchText(nodeText);
    setShowLeafNodes(false);
  };
  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    let questionIDs = cy.nodes().map((node) => node.data("id"));

    return inputLength === 0
      ? []
      : questionIDs.filter(
          (id) => id.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion.
  const getSuggestionValue = (suggestion) => suggestion;

  // Render a suggestion.
  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: "Search existing qID",
    value,
    onChange: onChange,
    className: "autosuggest-input", // Added class here
    style: {
      fontSize: "11px", // Adjust the font size according to your preference
    },
  };
  const theme = { 
    suggestionsContainerOpen: 'suggestions-container', 
    input: 'autosuggest-input' 
  };
  const handleInputChange = (event) => {
    const updatedSearchText = event.target.value;
    setSearchText(updatedSearchText);
  };
  
  return (
    <div>
      <div class="main-container">
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "20%",
            right: "80%",
            background: "#FFFFFF",
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className="logo-container">
            <img src={logo} alt="Company Logo" className="logo" />
          </div>

          <div className="drop-down">
            <Select
              className="chief-complaint"
              options={options}
              onChange={handleChange}
              styles={customStyles}
              placeholder="Search Chief Complaint"
            />
          </div>

          <div>
            <div className="search-box">
              <input
                type="text"
                value={searchText}
                onChange={handleInputChange} // Assuming you have an event handler for input change
                onClick={handleSearchBoxClick}
                placeholder="Search Diagnosis..."   
              />
              {showLeafNodes && (
                <div className="leaf-node-list">
                  {leafNodes.map((nodeText) => (
                    <div onClick={() => handleLeafNodeSelect(nodeText)}>
                      {nodeText}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="search-button">
              <button onClick={onSearch}>Search</button>
            </div>
          </div>
          <div className="line1"></div>

          <div
            className="section1-button-container"
            style={{ position: "relative", zIndex: 2 }}
          >
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
            <button
              onClick={onRemoveSelectedNode}
              style={{ height: "76px", lineHeight: "19px" }}
            >
              Remove Selected <br></br>Node
            </button>
            <button
              onClick={onRemoveSelectedEdge}
              style={{ height: "76px", lineHeight: "19px" }}
            >
              Remove Selected<br></br> Edge
            </button>
          </div>
          <div className="line2"></div>
          <div
            className="section2-button-container"
            style={{ position: "relative", zIndex: 2 }}
          >
            <button className="dfs" onClick={onDFS}>
              D-F-S
            </button>
            <button className="bfs" onClick={onBFS}>
              B-F-S
            </button>
            <button className="undo" onClick={onUndo}>
              Undo
            </button>
            <button className="redo" onClick={onRedo}>
              Redo
            </button>
          </div>

          <div className="save-button">
            {" "}
            <button className="save" type="button" onClick={onSubmit}>
              Save
            </button>{" "}
          </div>
          <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      theme={theme} // Applied the theme here
    />
        </div>
      </div>
      {/* Left-Side-End */}
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "80%",
          left: "20%",
          background: "#EFF1FF",
          // border: "1px solid ",
        }}
      >
        <div className="doctor-profile">
          <div className="user-profile">
            <h3>Dr. Varis1807</h3>
          </div>
          <div className="daddu">
            <img src={daddu}></img>
          </div>
        </div>

        <div className="twoButton">
          <button className="prev" onClick={onPrev}>
            ⇦ Prev ({pathCount}/{totalCount - 1})
          </button>
          <button className="next" onClick={onNext}>
            Next({pathCount}/{totalCount - 1}) ⇨{" "}
          </button>
        </div>
        <div ref={cyRef} style={{ width: "100%", height: "97vh" }} />
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
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                height: "30px", // Set the desired height
                textAlign: "center", // Align text to center
                fontSize: "16px", // Set the desired font size
              }}
            />
            <button type="submit">Save</button>
          </form>
        )}
      </div>
    </div>
  );
}

function getTextWidth(text) {
  const span = document.createElement("span");
  span.style.visibility = "hidden";
  span.style.whiteSpace = "nowrap";
  span.style.position = "absolute";
  span.style.left = "-9999px";
  span.innerHTML = text;
  document.body.appendChild(span);
  const width = span.offsetWidth;
  document.body.removeChild(span);
  return width;
}
function generateCytoscapeElements(data) {
  const nodes = [];
  const edges = [];
  const nodeIds = new Set();

  data?.forEach((item) => {
    const label = item.is_diagnoisis
      ? Array.isArray(Object.values(item.options)[0])
        ? Object.values(item.options)[0].join(", ")
        : Object.values(item.options)[0]
      : item.question;

    nodes.push({
      data: {
        id: item.queid,
        label: label,
        parent: item.parentId,
        collapsed: item.queid === "root" ? false : true,
        _children: [],
      },
    });
    nodeIds.add(item.queid);
  });

  data?.forEach((item) => {
    if (item.options && !item.is_diagnoisis) {
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
        nodes
          .find((node) => node.data.id === item.queid)
          .data._children.push(target);
      });
    }
  });

  // Find leaf nodes and add their labels to allLeafNodes array
  nodes.forEach((node) => {
    if (!node.data._children.length) {
      allLeafNodes.push(node.data.label);
    }
  });
  return [...nodes, ...edges];
}

export default DecisionTree;
