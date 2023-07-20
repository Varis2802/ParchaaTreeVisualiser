import React from 'react';
import { useNavigate } from 'react-router';
import './Instructions.css'; // Assuming you have an external CSS file

function Instructions() {
    let navigate=useNavigate();
    return (
        <div className="instructionsContainer">
            <h1>Welcome to Our Application</h1>
            <p>Before diving in, here are some useful instructions to navigate our application:</p>
            <ol>
                <li>The Undo/Redo functionality is pre-activated for your convenience. You can undo or redo any of your previous actions.</li>
                <li>Initially, the view will be fitted to the root node, known as "Q1", with a 50-pixel padding around it for clear visibility.</li>
                <li>The view is also zoomed to a level of 0.4 to provide you with a detailed view.</li>
                <li>The root node (Q1) will be positioned at the center of your screen.</li>
                <li>A prolonged tap (or 'taphold') on any node will trigger a form at that node's position, enabling you to edit the node's label.</li>
                <li>Similarly, 'taphold' on any edge will open a form at the edge's starting position. This form allows you to edit the edge's label.</li>
                <li>A new type of click, known as 'context tap' (or 'cxttap'), is activated for nodes. This will trigger additional functions when used, offering a unique user experience.</li>
                <li>On selecting a node, the node is set for removal and will serve as the starting point for any depth-first search (DFS) function.</li>
                <li>On selecting an edge, the edge will be set for removal, and its color will change to red, signifying its selection.</li>
                <li>Hovering over a node will prompt a tooltip to appear, displaying the QuestionID of the node. The tooltip will disappear once you move away from the node.</li>
                <li>If you double-click on any node, the path from that node to the root node will be highlighted, facilitating easy navigation through larger maps.</li>
                <li>A Pan-Zoom control is located at the bottom right of your screen, allowing you to pan across the view or zoom in and out at your convenience.</li>
            </ol>
            <button onClick={() => {navigate("/parchaa-cortex")}}>Get Started</button>

        </div>
    );
}

export default Instructions;
