

import React, { Component } from "react";
import Node from './Node/Node';
import './PathfindingVisualizer.css';
import { dijkstra, getNodeInSortestPathOrder } from "./Algorithms/Dijkstra";

const start_row_node = 10;
const start_col_node = 20;
const end_row_node = 15;
const end_col_node = 50;

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({ grid });
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
    }

    handleMouseUp() {
        this.setState({ mouseIsPressed: false });
    }

    //Marks nodes in the shortest path with the CSS class 
    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    }

    //Iterates over visitedNodesInOrder and marks cells as visited by changing their CSS class
    animateDijkstra(visitedNodesInOrder, nodeInSortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            //Once all nodes are visited, calls animateShortestPath.
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodeInSortestPathOrder);
                }, 10 * i);
                return;
            }

            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 10 * i);
        }
    }

    visualizeDijkstra() {
        const { grid } = this.state;
        const startNode = grid[start_row_node][start_col_node];
        const finishNode = grid[end_row_node][end_col_node];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodeInSortestPathOrder = getNodeInSortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodeInSortestPathOrder);
    }

    //It dynamically displays the grid and provides user interactions for visualizing Dijkstra's algorithm.

    handleLearnMore(event) {
        const url = event.target.value;
        if (url) {
            window.open(url, "_blank"); // Open the selected link in a new tab
        }
    }

    render() {
        const { grid, mouseIsPressed } = this.state;

        return (
            <>
                {/* Navigation Bar */}
                <nav className="navbar">
                    <div className="navbar-title">
                        Algorithm Visualizer
                    </div>
                    <div className="navbar-controls">
                        <button
                            className="start-button"
                            onClick={() => this.visualizeDijkstra()}
                        >
                            Visualize Algorithm
                        </button>
                        <div className="navbar-dropdown">
                            {/* <label htmlFor="algorithm-select">Choose Algorithm:</label> */}
                            <select
                                id="algorithm-select"
                                className="dropdown"
                                onChange={(e) =>
                                    this.setState({ selectedAlgorithm: e.target.value })
                                }
                            >
                                <option value="">Select Algorithm</option>
                                <option value="dijkstra">Dijkstra's Algorithm</option>
                                <option value="sorting">Sorting Algorithm</option>
                                {/* Add more algorithms here */}
                            </select>
                        </div>
                        <div className="navbar-dropdown">
                            {/* <label htmlFor="info-select">Learn About:</label> */}
                            <select
                                id="info-select"
                                className="dropdown"
                                onChange={(e) => this.handleLearnMore(e)}
                            >
                                <option value="">Learn Algorithms</option>
                                <option value="https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm">
                                    Dijkstra's Algorithm
                                </option>
                                <option value="https://en.wikipedia.org/wiki/Sorting_algorithm">
                                    Sorting Algorithm
                                </option>
                                {/* Add more links here */}
                            </select>
                        </div>
                        <div className="navbar-dropdown">
                            {/* <label htmlFor="info-select">Learn About:</label> */}
                            <select
                                id="info-select"
                                className="dropdown"
                                onChange={(e) => this.handleLearnMore(e)}
                            >
                                <option value="">Learning Material</option>
                                <option value="https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm">
                                    Dijkstra's Algorithm
                                </option>
                                <option value="https://en.wikipedia.org/wiki/Sorting_algorithm">
                                    Sorting Algorithm
                                </option>
                                {/* Add more links here */}
                            </select>
                        </div>
                    </div>
                </nav>

                {/* Grid */}
                <div className="grid-container">
                    <div className="grid">
                        {grid.map((row, rowIdx) => {
                            return (
                                <div key={rowIdx}>
                                    {row.map((node, nodeIdx) => {
                                        const { row, col, isFinish, isStart, isWall } = node;
                                        return (
                                            <Node
                                                key={nodeIdx}
                                                col={col}
                                                isFinish={isFinish}
                                                isStart={isStart}
                                                isWall={isWall}
                                                mouseIsPressed={mouseIsPressed}
                                                onMouseDown={(row, col) =>
                                                    this.handleMouseDown(row, col)
                                                }
                                                onMouseEnter={(row, col) =>
                                                    this.handleMouseEnter(row, col)
                                                }
                                                onMouseUp={() => this.handleMouseUp()}
                                                row={row}
                                            ></Node>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }

}

// Node Components:
// Each cell in the grid is represented as a Node component, which is modular and receives properties and event handlers to handle interactivity.

// Dynamic Rendering:
// The grid is dynamically rendered based on the grid state. Changes to the grid (e.g., adding walls) automatically update the UI due to React's state-based rendering.

// Event Handling for Interactivity:
// The event handlers (onMouseDown, onMouseEnter, onMouseUp) allow users to toggle walls interactively, enhancing the user experience.

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 21; row++) {
        const currRow = [];
        for (let col = 0; col < 60; col++) {
            currRow.push(createNode(col, row));
        }
        grid.push(currRow);
    }
    return grid;
};

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === start_row_node && col === start_col_node,
        isFinish: row === end_row_node && col === end_col_node,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    //A shallow copy of the grid is created using slice(). 
    //This ensures that the original grid is not mutated directly, maintaining React's principle of immutability.
    const newGrid = grid.slice();
    //The specific cell (node) at the given row and col is accessed from the copied grid
    const node = newGrid[row][col];
    //A new node is created by copying all properties of the existing node using the spread operator (...node).
    const newNode = {
        ...node,
        //The isWall property of the new node is toggled
        isWall: !node.isWall,
    };
    //The new node replaces the old node at the specified position in the copied grid
    newGrid[row][col] = newNode;
    return newGrid;
};