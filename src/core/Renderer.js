import * as d3 from 'd3';

export class Renderer {
    constructor(container, graph) {
        this.container = container;
        this.graph = graph;
        
        // Create layers: ways at the bottom, nodes on top
        this.wayLayer = container.append('g').attr('class', 'way-layer');
        this.nodeLayer = container.append('g').attr('class', 'node-layer');

        this.graph.subscribe(() => this.render());
    }

    render() {
        const nodes = this.graph.allNodes;
        const ways = this.graph.allWays;
        
        console.log(`Renderer: Rendering ${nodes.length} nodes and ${ways.length} ways`);

        // 1. DRAW NODES
        const nodeSelection = this.nodeLayer.selectAll('.node')
            .data(nodes, d => d.id);

        nodeSelection.join(
            enter => enter.append('circle')
                .attr('class', 'node')
                .attr('r', 8)
                .attr('fill', 'white')
                .attr('stroke', '#333')
                .attr('stroke-width', 2)
                // Set initial position immediately on enter
                .attr('cx', d => d.x)
                .attr('cy', d => d.y),
            update => update
                // Update position if data changed (e.g., dragging)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
        );

        // 2. DRAW WAYS
        const lineGen = d3.line()
            // Pull coordinates from the graph using the node IDs stored in the way
            .x(id => this.graph.nodes.get(id)?.x || 0)
            .y(id => this.graph.nodes.get(id)?.y || 0);

        const waySelection = this.wayLayer.selectAll('.way')
            .data(ways, d => d.id);

        waySelection.join(
            enter => enter.append('path')
                .attr('class', 'way')
                .attr('fill', 'none')
                .attr('stroke', 'blue')
                .attr('stroke-width', 3)
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                // Set initial path immediately
                .attr('d', d => lineGen(d.nodes)),
            update => update
                .attr('d', d => lineGen(d.nodes))
        );
    }
}