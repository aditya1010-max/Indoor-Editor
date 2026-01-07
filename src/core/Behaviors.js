import * as d3 from 'd3';
import { findClosestNode } from '../utils/math.js';

export class Behaviors {
    constructor(svg, mainLayer, graph) {
        this.svg = svg;
        this.mainLayer = mainLayer;
        this.graph = graph;
        
        this.mode = 'browse'; 
        this.activeWayId = null;
        
        this.setupEvents();
    }

    setMode(newMode) {
        this.mode = newMode;
        console.log(`Behaviors: Mode switched to ${this.mode}`);
        if (this.mode === 'browse') {
            this.activeWayId = null;
        }
    }

    setupEvents() {
        this.svg.on('click', (event) => {
            if (this.mode !== 'draw') return;

            // 1. Get coordinates relative to the zoomed layer
            const coords = d3.pointer(event, this.mainLayer.node());
            if (!coords || isNaN(coords[0])) return;
            const mousePoint = { x: coords[0], y: coords[1] };

            // 2. Snapping Logic: Check if we are clicking near an existing node
            const threshold = 15; // pixels
            const snappedNode = findClosestNode(this.graph.allNodes, mousePoint, threshold);

            let nodeId;

            if (snappedNode) {
                // Use the existing node ID instead of creating a new one
                nodeId = snappedNode.id;
                console.log(`Behaviors: Snapped to node ${nodeId}`);
            } else {
                // Create a new node if no existing node is close
                nodeId = `n${Date.now()}`;
                this.graph.addNode({ id: nodeId, x: mousePoint.x, y: mousePoint.y });
                console.log(`Behaviors: Created new node ${nodeId}`);
            }

            // 3. Handle Way Logic
            if (!this.activeWayId) {
                // Start a new way
                this.activeWayId = `w${Date.now()}`;
                this.graph.addWay({ 
                    id: this.activeWayId, 
                    nodes: [nodeId], 
                    tags: { type: 'corridor' } 
                });
            } else {
                // Check if the last node in the way is the same as the current node
                // (Prevents double-clicking the same node adding it twice to the way)
                const currentWay = this.graph.ways.get(this.activeWayId);
                const lastNodeId = currentWay.nodes[currentWay.nodes.length - 1];
                
                if (lastNodeId !== nodeId) {
                    this.graph.addNodeToWay(nodeId, this.activeWayId);
                }
            }

                            // Add this inside setupEvents() in Behaviors.js
                window.addEventListener('keydown', (e) => {
                    if (e.key === 'Delete' || e.key === 'Backspace') {
                        // This requires a 'selectedId' property which you can set on click
                        if (this.selectedId) {
                            this.graph.removeNode(this.selectedId);
                            this.selectedId = null;
                            console.log("Deleted selected node");
                        }
                    }
                });
        });
    }
}