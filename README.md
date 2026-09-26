# AI-Based Warehouse Picking Path Optimizer

## Overview

The AI-Based Warehouse Picking Path Optimizer is a web-based warehouse route planning prototype.

The system uses the A* pathfinding algorithm to calculate an efficient route for warehouse pickers.

## Problem

Warehouse picking involves movement between different item locations.

Unnecessary walking can increase:

- Travel distance
- Picking time
- Worker effort
- Operational cost

## Solution

The system creates an optimized route between the warehouse start point and required item locations.

It compares:

1. Baseline route
2. Optimized route

The dashboard displays the distance saved and estimated walking time.

## Features

- Interactive warehouse map
- A* pathfinding
- Multiple orders
- Item locations
- Route optimization
- Baseline comparison
- Distance calculation
- Estimated walking time
- Picker simulation
- Workload visualization
- Dynamic route recalculation
- Responsive interface

## Technology

- HTML
- CSS
- JavaScript
- A* Algorithm
- GitHub Pages

## A* Algorithm

The A* algorithm uses:

f(n) = g(n) + h(n)

Where:

g(n) = cost from start to current node

h(n) = estimated cost from current node to goal

f(n) = total estimated cost

The Manhattan distance is used as the heuristic.

## Workflow

Observe
↓
Learn
↓
Recommend
↓
Adapt

## Future Enhancements

- Live warehouse data
- WMS integration
- Real-time order arrival
- Congestion-aware routing
- Multiple picker collision avoidance
- Machine learning based demand prediction
- Supervisor override system

## Author

Rahul K
BE CSE
