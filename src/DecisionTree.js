import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';

function DecisionTree({data}) {
    useEffect(() => {
        const elements = generateCytoscapeElements(data);
        
        const cy = cytoscape({
            container: document.getElementById('cy'), // container to render in
            elements: elements,
            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'background-color': '#666',
                        'label': 'data(id)'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle'
                    }
                }
            ],
            layout: {
                name: 'breadthfirst'
            }
        });
    }, [data]);

    return (
        <div id="cy" style={{width: '100%', height: '100vh'}} />
    );
}

function generateCytoscapeElements(data) {
    const elements = [];
    
    data.forEach((item) => {
        elements.push({
            data: { id: item.queid, label: item.question }
        });

        if (item.options) {
            Object.values(item.options).forEach((target) => {
                elements.push({
                    data: { id: `${item.queid}${target}`, source: item.queid, target }
                });
            });
        }
    });
    
    return elements;
}

export default DecisionTree;
