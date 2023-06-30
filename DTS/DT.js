import React, { useState, useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import dagre from 'cytoscape-dagre';


// Register the extensions
cytoscape.use(dagre);

// Include the CSS for the context menus


function DecisionTree({ data }) {
  const cyRef = useRef(null);
  const [editingNode, setEditingNode] = useState(null);
  const [editingEdge, setEditingEdge] = useState(null);
  const [formPosition, setFormPosition] = useState({ x: 0, y: 0 });
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (!cyRef.current) return;

    const elements = generateCytoscapeElements(data);

    const cy = cytoscape({
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
              "target-arrow-shape": "vee",
              "arrow-scale": 1.5,
              label: "data(label)",
              "text-rotation": "autorotate",
              "font-size": "9px",
            },
          },         
        ],
        layout: {
            name: "dagre",
            rankDir: "TB",
            rankSep: 100,
            edgeLength: 100,
            edgeWeights: true, // Enable edge weights for the unbundled-bezier curve style
          },          
      });
    // Register event handlers
        // Register event handlers
        cy.on("taphold", "node", function (evt) {
            const node = evt.target;
            setFormPosition(node.renderedPosition());
            setInputText(node.data("label"));
            setEditingNode(node);
          });
          
          cy.on("taphold", "edge", function (evt) {
            const edge = evt.target;
            setFormPosition(edge.source().renderedPosition());
            setInputText(edge.data("label"));
            setEditingEdge(edge);
          });
          
        }, [cyRef, data]);
      
        const onSubmit = (e) => {
          e.preventDefault();
          if (editingNode) {
            editingNode.data("label", inputText);
          } else if (editingEdge) {
            editingEdge.data("label", inputText);
          }
          setInputText("");
          setEditingNode(null);
          setEditingEdge(null);
        };
      
        return (
          <div style={{ position: "relative" }}>
            <div ref={cyRef} style={{ width: "100%", height: "100vh" }} />
            {(editingNode || editingEdge) && (
              <form
                style={{ position: "absolute", top: formPosition.y, left: formPosition.x }}
                onSubmit={onSubmit}
              >
                <input value={inputText} onChange={(e) => setInputText(e.target.value)} />
                <button type="submit">Save</button>
              </form>
            )}
          </div>
        );
      }
      
      function generateCytoscapeElements(data) {
        const nodes = [];
        const edges = [];
        const nodeIds = new Set();
      
        data.forEach((item) => {
          nodes.push({
            data: { id: item.queid, label: item.question, collapsed: false },
          });
          nodeIds.add(item.queid);
        });
      
        data.forEach((item) => {
          if (item.options) {
            Object.entries(item.options).forEach(([option, target]) => {
              if (!nodeIds.has(target)) {
                console.warn(`Skipping edge from ${item.queid} to non-existent target ${target}`);
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