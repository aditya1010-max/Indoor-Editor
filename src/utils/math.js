// src/util/Math.js

export function getDistance(p1, p2) {
    if (!p1 || !p2) return Infinity;
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Finds the closest node to a given point.
 * @param {Array} nodes - Should be graph.allNodes (the array version)
 * @param {Object} point - {x, y} coordinates of the mouse
 * @param {number} threshold - Maximum distance in pixels to allow snapping
 */
export function findClosestNode(nodes, point, threshold = 20) {
    let closest = null;
    let minDistance = threshold;

    nodes.forEach(node => {
        const dist = getDistance(node, point);
        if (dist < minDistance) {
            minDistance = dist;
            closest = node;
        }
    });

    return closest;
}