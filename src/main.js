import * as d3 from 'd3';
import { Graph } from './core/Graph.js';
import { Renderer } from './core/Renderer.js';
import { Behaviors } from './core/Behaviors.js';

// 1. Setup Data & Engine
const graph = new Graph();

// 2. Setup Canvas
const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select("#editor")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#f0f0f0");

// The 'g' element that holds all drawing and handles zoom transforms
const mainLayer = svg.append("g").attr("class", "main-layer");

// 3. Initialize Components
const renderer = new Renderer(mainLayer, graph);
const behaviors = new Behaviors(svg, mainLayer, graph);

// 4. Attach Zoom Behavior (Browse Mode)
const zoom = d3.zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", (event) => {
        // Only zoom/pan if we are in browse mode
        if (behaviors.mode === 'browse') {
            mainLayer.attr("transform", event.transform);
        }
    });

svg.call(zoom);

// 5. Connect UI Buttons
d3.select('#draw-btn').on('click', function() {
    behaviors.setMode('draw');
    updateButtonStyles(this);
});

d3.select('#browse-btn').on('click', function() {
    behaviors.setMode('browse');
    updateButtonStyles(this);
});

function updateButtonStyles(activeBtn) {
    d3.selectAll('button').classed('active', false);
    d3.select(activeBtn).classed('active', true);
    d3.select('#status').text(`Mode: ${behaviors.mode}`);
}

// 6. Initial Data & First Render
graph.addNode({ id: 'n1', x: 100, y: 100 });
graph.addNode({ id: 'n2', x: 300, y: 300 });
graph.addWay({ id: 'w1', nodes: ['n1', 'n2'] });

// Force initial draw
renderer.render();

console.log("Main: Editor initialized and UI connected.");