const WIDTH = 15;
const HEIGHT = 10;


/* WAREHOUSE BLOCKED CELLS */

const blocked = new Set([

    "3,1",
    "3,2",
    "3,3",
    "3,4",

    "7,0",
    "7,1",
    "7,2",

    "10,4",
    "10,5",
    "10,6",

    "12,2",
    "12,3",
    "12,4",
    "12,5"

]);


/* START */

const start = [0, 0];


/* ITEM LOCATIONS */

const items = {

    A: [2, 2],

    B: [5, 1],

    C: [8, 3],

    D: [11, 7],

    E: [13, 8],

    F: [4, 7]

};


/* ORDERS */

const orders = [

    {
        id: "ORD-001",
        items: ["A", "C", "E"]
    },

    {
        id: "ORD-002",
        items: ["B", "D", "F"]
    },

    {
        id: "ORD-003",
        items: ["A", "D"]
    }

];


let currentRoute = [];

let simulationTimer;


/* KEY */

function key(position) {

    return position[0] + "," + position[1];

}


/* MANHATTAN DISTANCE */

function heuristic(a, b) {

    return Math.abs(a[0] - b[0])
         + Math.abs(a[1] - b[1]);

}


/* CHECK WALKABLE */

function isWalkable(position) {

    return (

        position[0] >= 0 &&

        position[0] < WIDTH &&

        position[1] >= 0 &&

        position[1] < HEIGHT &&

        !blocked.has(key(position))

    );

}


/* A* ALGORITHM */

function aStar(startNode, goalNode) {

    let openList = [

        {
            position: startNode,

            cost: 0,

            priority: heuristic(startNode, goalNode)

        }

    ];


    let cameFrom = {};

    let cost = {};

    cost[key(startNode)] = 0;


    let visited = new Set();


    while (openList.length > 0) {

        openList.sort(

            (a, b) =>
                a.priority - b.priority

        );


        let current = openList.shift();

        let currentKey = key(current.position);


        if (visited.has(currentKey)) {

            continue;

        }


        visited.add(currentKey);


        /* GOAL */

        if (

            current.position[0] === goalNode[0] &&

            current.position[1] === goalNode[1]

        ) {

            let path = [current.position];

            let nodeKey = currentKey;


            while (cameFrom[nodeKey]) {

                let previous =
                    cameFrom[nodeKey];

                path.push(previous);

                nodeKey = key(previous);

            }


            return path.reverse();

        }


        const directions = [

            [1, 0],

            [-1, 0],

            [0, 1],

            [0, -1]

        ];


        for (let direction of directions) {

            let next = [

                current.position[0]
                    + direction[0],

                current.position[1]
                    + direction[1]

            ];


            if (!isWalkable(next)) {

                continue;

            }


            let nextKey = key(next);

            let newCost =
                current.cost + 1;


            if (

                cost[nextKey] === undefined ||

                newCost < cost[nextKey]

            ) {

                cost[nextKey] = newCost;

                cameFrom[nextKey] =
                    current.position;


                openList.push({

                    position: next,

                    cost: newCost,

                    priority:
                        newCost
                        + heuristic(
                            next,
                            goalNode
                        )

                });

            }

        }

    }


    return [];

}


/* BASELINE ROUTE */

function createBaselineRoute(order) {

    let current = [...start];

    let route = [current];


    for (let item of order.items) {

        let target = items[item];

        let segment =
            aStar(current, target);


        route.push(
            ...segment.slice(1)
        );


        current = [...target];

    }


    return route;

}


/* OPTIMIZED ROUTE */

function createOptimizedRoute(order) {

    let current = [...start];

    let route = [current];


    let remaining =
        order.items.map(
            item => [...items[item]]
        );


    while (remaining.length > 0) {

        let bestIndex = 0;


        for (
            let i = 1;
            i < remaining.length;
            i++
        ) {

            if (

                heuristic(
                    current,
                    remaining[i]
                )

                <

                heuristic(
                    current,
                    remaining[bestIndex]
                )

            ) {

                bestIndex = i;

            }

        }


        let target =
            remaining.splice(
                bestIndex,
                1
            )[0];


        let segment =
            aStar(
                current,
                target
            );


        route.push(
            ...segment.slice(1)
        );


        current = target;

    }


    return route;

}


/* DRAW WAREHOUSE */

function drawWarehouse(route = [], pickerIndex = -1) {

    const map =
        document.getElementById(
            "warehouseMap"
        );


    map.innerHTML = "";


    for (
        let y = 0;
        y < HEIGHT;
        y++
    ) {

        for (
            let x = 0;
            x < WIDTH;
            x++
        ) {

            let cell =
                document.createElement(
                    "div"
                );


            cell.className = "cell";


            let position = [x, y];

            let positionKey =
                key(position);


            /* BLOCKED */

            if (
                blocked.has(
                    positionKey
                )
            ) {

                cell.classList.add(
                    "blocked"
                );

            }


            /* ROUTE */

            let routePosition =
                route.find(
                    point =>
                        point[0] === x &&
                        point[1] === y
                );


            if (routePosition) {

                cell.classList.add(
                    "route"
                );

            }


            /* START */

            if (
                x === start[0] &&
                y === start[1]
            ) {

                cell.classList.add(
                    "start"
                );

            }


            /* ITEMS */

            for (
                let item in items
            ) {

                if (

                    items[item][0] === x &&
                    items[item][1] === y

                ) {

                    cell.classList.add(
                        "item"
                    );

                    cell.textContent =
                        item;

                }

            }


            /* PICKER */

            if (

                pickerIndex >= 0 &&

                route[pickerIndex] &&

                route[pickerIndex][0] === x &&

                route[pickerIndex][1] === y

            ) {

                cell.className =
                    "cell picker";

                cell.textContent =
                    "●";

            }


            map.appendChild(cell);

        }

    }

}


/* CALCULATE */

function calculateRoute() {

    let selected =
        Number(
            document.getElementById(
                "orderSelect"
            ).value
        );


    let order =
        orders[selected];


    let baseline =
        createBaselineRoute(
            order
        );


    let optimized =
        createOptimizedRoute(
            order
        );


    currentRoute =
        optimized;


    let baselineDistance =
        baseline.length - 1;


    let optimizedDistance =
        optimized.length - 1;


    let saved =
        baselineDistance
        - optimizedDistance;


    let efficiency =
        baselineDistance > 0

        ?

        (
            (saved / baselineDistance)
            * 100

        ).toFixed(1)

        :

        0;


    document.getElementById(
        "baselineDistance"
    ).textContent =
        baselineDistance
        + " cells";


    document.getElementById(
        "optimizedDistance"
    ).textContent =
        optimizedDistance
        + " cells";


    document.getElementById(
        "distanceSaved"
    ).textContent =
        saved
        + " cells";


    document.getElementById(
        "walkingTime"
    ).textContent =
        (
            optimizedDistance / 2
        ).toFixed(1)
        + " min";


    document.getElementById(
        "efficiency"
    ).textContent =
        efficiency + "%";


    document.getElementById(
        "status"
    ).textContent =
        "Route calculated";


    drawWarehouse(
        optimized
    );

}


/* START SIMULATION */

function startSimulation() {

    if (
        currentRoute.length === 0
    ) {

        calculateRoute();

    }


    clearInterval(
        simulationTimer
    );


    let index = 0;


    document.getElementById(
        "status"
    ).textContent =
        "Picking in progress";


    simulationTimer =
        setInterval(

            function () {

                drawWarehouse(
                    currentRoute,
                    index
                );


                index++;


                if (
                    index >=
                    currentRoute.length
                ) {

                    clearInterval(
                        simulationTimer
                    );


                    document.getElementById(
                        "status"
                    ).textContent =
                        "Picking completed";

                }

            },

            120

        );

}


/* NEW ORDER */

function newOrder() {

    let randomOrder =
        Math.floor(
            Math.random()
            * orders.length
        );


    document.getElementById(
        "orderSelect"
    ).value =
        randomOrder;


    updateOrder();

    calculateRoute();

}


/* UPDATE ORDER */

function updateOrder() {

    let selected =
        Number(
            document.getElementById(
                "orderSelect"
            ).value
        );


    let order =
        orders[selected];


    document.getElementById(
        "orderItems"
    ).textContent =
        order.items.join(
            " → "
        );

}


/* RESET */

function resetSystem() {

    clearInterval(
        simulationTimer
    );


    currentRoute = [];


    document.getElementById(
        "baselineDistance"
    ).textContent = "-";


    document.getElementById(
        "optimizedDistance"
    ).textContent = "-";


    document.getElementById(
        "distanceSaved"
    ).textContent = "-";


    document.getElementById(
        "walkingTime"
    ).textContent = "-";


    document.getElementById(
        "efficiency"
    ).textContent = "-";


    document.getElementById(
        "status"
    ).textContent =
        "Ready";


    drawWarehouse();

}


/* ORDER CHANGE */

document.getElementById(
    "orderSelect"
).addEventListener(

    "change",

    function () {

        updateOrder();

        calculateRoute();

    }

);


/* START */

updateOrder();

drawWarehouse();
