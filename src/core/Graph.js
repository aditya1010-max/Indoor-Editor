export class Graph {
    constructor() {
        this.nodes = new Map(); // id -> {id, x, y, tags}
        this.ways = new Map();  // id -> {id, nodes: [], tags}
        this.listeners = [];
    }

    // Add a listener to call when data changes
    subscribe(callback) {
        this.listeners.push(callback);
    }

    _notify() {
        // console.log("Graph: Notifying listeners of change...");
        this.listeners.forEach(fn => fn(this));
    }

    addNode(node) {
        // Ensure default tags exist to prevent crashes in renderer
        const newNode = { tags: {}, ...node };
        this.nodes.set(newNode.id, newNode);
        this._notify();
        return newNode;
    }

    addWay(way) {
        const newWay = { nodes: [], tags: {}, ...way };
        this.ways.set(newWay.id, newWay);
        this._notify();
        return newWay;
    }

    // Connect a node to a way
    addNodeToWay(nodeId, wayId) {
        const way = this.ways.get(wayId);
        // Safety: Ensure both way and node exist before connecting
        if (way && this.nodes.has(nodeId)) {
            way.nodes.push(nodeId);
            this._notify();
        } else {
            console.warn(`Graph: Could not connect ${nodeId} to ${wayId}. Missing one.`);
        }
    }

    moveNode(id, newX, newY) {
        const node = this.nodes.get(id);
        if (node) {
            node.x = newX;
            node.y = newY;
            this._notify(); 
        }
    }
        // Add to Graph.js
        getStats() {
            const closedWays = this.allWays.filter(w => w.nodes[0] === w.nodes[w.nodes.length - 1]);
            return {
                totalNodes: this.nodes.size,
                totalWays: this.ways.size,
                totalRooms: closedWays.length,
                orphanedNodes: this.allNodes.filter(n => 
                    !this.allWays.some(w => w.nodes.includes(n.id))
                ).length
            };
        }

    // Getters for D3
    get allWays() {
        return Array.from(this.ways.values());
    }

    get allNodes() {
        return Array.from(this.nodes.values());
    }

    // Useful for debugging
    clear() {
        this.nodes.clear();
        this.ways.clear();
        this._notify();
    }
}