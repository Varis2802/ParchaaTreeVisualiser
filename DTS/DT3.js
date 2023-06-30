import React, { useState, useEffect, useRef } from "react";
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
            "background-color": "#89c9b8",
            "border-width": 2,
            "border-color": "#5a7d5a",
            shape: "rectangle",
            "text-wrap": "wrap",
            //"text-max-width": 80,
            "text-valign": "center",
            content: "data(label)",
            color: "#304455",
            "font-size": "12px",
            "text-width-padding": "10px",
            "text-height-padding": "10px",
            width: "label",
            height: "40",
          },
        },
        // Edge style
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#a8df65",
            "curve-style": "taxi", // Use the unbundled-bezier curve style
            "target-arrow-color": "#a8df65",
            "target-arrow-shape": "triangle-tee",
            "arrow-scale": 1.5,
            label: "data(label)",
            "text-rotation": "outline",
            "font-size": "9px",
          },
        },
      ],
      layout: {
        name: "dagre",
        rankDir: "LR",
        rankSep: 100,
        edgeLength: 100,
       // edgeWeights: true, // Enable edge weights for the unbundled-bezier curve style
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

    cyInstance.on('select', 'node', function(evt){
        const node = evt.target;
        setRemovingNode(node);
      });
  
      cyInstance.on('select', 'edge', function(evt){
        const edge = evt.target;
        setRemovingEdge(edge);
      });
  
  }, [cyRef, data]);

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
      <div className="button-container">
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
     
</div>

      <div style={{ position: "relative" }}>
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
    nodes.push({
      data: { id: item.queid, label: item.question, collapsed: true },
    });
    nodeIds.add(item.queid);
  });

  data.forEach((item) => {
    if (item.options) {
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
      });
    }
  });

  return [...nodes, ...edges];
}

export default DecisionTree;
