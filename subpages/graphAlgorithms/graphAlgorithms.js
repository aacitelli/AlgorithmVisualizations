//! GLOBAL VARIABLES AND GENERAL SETUP 
// The canvas that will display everything that's actually processed here in the code 
var canvas = document.getElementById("canvas");
var canvasWidth = 500, canvasHeight = 500;

// Controls drawing on the canvas itself 
var ctx = canvas.getContext("2d");
ctx.font = "16pt Arial";

// Used to show at the end what order the algorithm went in 
var visitOrder = document.getElementById("visitOrder");
var debugOutput = document.getElementById("debugOutput");

// Buttons are used a lot so they're defined globally 
var clearButton = document.getElementById("clearButton");
var newNodeButton = document.getElementById("newNodeButton");
var deleteNodeButton = document.getElementById("deleteNodeButton");
var nodeSelectButton = document.getElementById("nodeSelectButton");
var bfsButton = document.getElementById("bfsButton");
var dfsButton = document.getElementById("dfsButton");
var drawConnectionButton = document.getElementById("drawConnectionButton");

// Globals
var startNodeID = -1;
var currentMode = 0;

// Holds currently taken ID numbers
var nodeList = [];

// Tracks the next available ID 
var currentID = 0;

// Holds edges in format {startNodeID, endNodeID}
var edgeList = [];

//! CUSTOM CLASSES
// Generic point object 
function Point(x, y)
{
    this.x = x;
    this.y = y;
}

// "Node" Definition
// x => x-coordinate of node
// y => y-coordinate of node 
// id => A unique numerical identifier 
// connections => An array of node id's that this one points to 
function Node(x, y, id, connections)
{
    this.x = x;
    this.y = y; 
    this.id = id;
    this.connections = connections;
}

function Edge(startNodeID, endNodeID)
{
    this.startNodeID = startNodeID;
    this.endNodeID = endNodeID;
}

//! EVENT LISTENERS
document.addEventListener("click", function(event)
{
    // These are absolute click coordinates
    clickCoordinates = new Point(event.x, event.y);

    // Checks if the click was inside the canvas 
    if (clickCoordinates.x > (document.body.clientWidth - canvasWidth) / 2 && clickCoordinates.x < (document.body.clientWidth - canvasWidth) / 2 + canvasWidth && 
        clickCoordinates.y > 20 && clickCoordinates.y < 20 + canvasHeight)
    {
        // Translate click coordinates into canvas coordinates via an offset function
        canvasCoordinates = absoluteToCanvas(clickCoordinates);

        switch(currentMode)
        {
            // Clear Screen
            case 0: 
                break; // Do nothing, as all behavior is controlled in the button's onClickListener 
            
            // New Node
            case 1: 
                makeNewNode(canvasCoordinates);
                break;

            // Delete Node
            case 2:
                deleteNode(canvasCoordinates);
                break;

            // Select Node
            case 3: 
                selectNode(canvasCoordinates);
                break;

            // Run BFS on Selected Node
            case 4: 
                break;

            // Run DFS on Selected Node
            case 5: 
                break;

            // This uses the mousedown and mouseup event listeners, therefore this specific case is empty 
            case 6: 
                break;
        }
    }
});

document.addEventListener("mousedown", function(event)
{
    // If we're currently in "draw connections" mode
    if (currentMode === 6)
    {
        let absoluteCoords = new Point(event.x, event.y);

        // If the click was inside the canvas
        if (absoluteCoords.x > (document.body.clientWidth - canvasWidth) / 2 && absoluteCoords.x < (document.body.clientWidth - canvasWidth) / 2 + canvasWidth && 
        absoluteCoords.y > 20 && absoluteCoords.y < 20 + canvasHeight)
        {
            let canvasCoords = absoluteToCanvas(absoluteCoords);

            let candidateStartNodeID = getPointNodeID(canvasCoords);
            if (candidateStartNodeID === -1)
            {
                debugOutput.textContent = "Start node not found!";
                console.log("Start node not found!");

                return;
            }

            // Only gets to this point if it found a valid start node 
            startNodeID = candidateStartNodeID;
        }
    }
});

document.addEventListener("mouseup", function(event)
{
    // If we're currently in "draw connections" mode and we have a valid start node 
    if (currentMode === 6 && startNodeID !== -1)
    {
        let absoluteCoords = new Point(event.x, event.y);

        // If the click was inside the canvas
        if (absoluteCoords.x > (document.body.clientWidth - canvasWidth) / 2 && absoluteCoords.x < (document.body.clientWidth - canvasWidth) / 2 + canvasWidth && 
        absoluteCoords.y > 20 && absoluteCoords.y < 20 + canvasHeight)
        {

            let canvasCoords = absoluteToCanvas(absoluteCoords);

            let endNodeID = getPointNodeID(canvasCoords);
            if (endNodeID === -1)
            {
                debugOutput.textContent = "End node not found!";
                console.log("End node not found!");
                
                return;
            }

            if (endNodeID === startNodeID)
            {
                debugOutput.textContent = "Start node cannot be the same as end node!   ";
                console.log("Start node cannot be the same as end node!");
                return;
            }

            // Only gets to this point if it found a valid end node 
            if (!lineExists(startNodeID, endNodeID))
            {
                drawLine(startNodeID, endNodeID);
            }
        }
    }    
});

clearButton.addEventListener("click", function()
{
    currentMode = 0;
    clearCanvas();
    updateActiveButton();
});

newNodeButton.addEventListener("click", function()
{
    currentMode = 1;
    updateActiveButton();
});

deleteNodeButton.addEventListener("click", function()
{
    currentMode = 2;
    updateActiveButton();
});

nodeSelectButton.addEventListener("click", function()
{
    currentMode = 3;
    updateActiveButton();
});

bfsButton.addEventListener("click", function()
{
    currentMode = 4;
    updateActiveButton();
});

dfsButton.addEventListener("click", function()
{
    currentMode = 5;
    updateActiveButton();
});

drawConnectionButton.addEventListener("click", function()
{
    currentMode = 6;
    updateActiveButton();
});

//! SEARCH ALGORITHMS
function bfs(startNodeID)
{
    /* Algorithm: 

        Visit the start node. 
        Visit all neighbors of the start node. 
        Visit all neighbors of the neighbors of the start node. 
        Continue the process until all vertices have been visited.

    */
}

function dfs(startNodeID)
{
    /* Algorithm:

        Put start node under consideration. 
        Run the algorithm on all neighbors. 
        If the current node has no neighbors, visit this node and return
            - This is the exit case; The method is recursive 

    */
}

//! EDGE MANAGEMENT FUNCTIONS
function lineExists(startNodeID, endNodeID)
{
    for (let i = 0; i < edgeList.length; i++)
    {
        if (edgeList[i].startNodeID === startNodeID && edgeList[i].endNodeID === endNodeID ||
            edgeList[i].endNodeID === startNodeID && edgeList[i].startNodeID === endNodeID)
        {
            debugOutput.textContent = "Edge already exists!";
            console.log("Edge already exists!");

            return true;
        }
    }

    return false;  
}

function drawLine(startNodeID, endNodeID)
{
    // Finding the two relevant index values in nodeList
    var startNodeIndex = -1, endNodeIndex = -1;
    for (let i = 0; i < nodeList.length; i++)
    {
        if (nodeList[i].id === startNodeID)
            startNodeIndex = i;
        if (nodeList[i].id === endNodeID)
            endNodeIndex = i;

        // Case for breakout out of loop early b/c we got what we came for 
        if (startNodeIndex !== -1 && endNodeIndex !== -1)
            break;
    }

    if (startNodeIndex === -1)
    {
        debugOutput.textContent = "Could not find start node with given index.";
        console.error("Could not find start node with given index.");

        return true;
    }

    if (endNodeIndex === -1)
    {
        debugOutput.textContent = "Could not find end node with given index.";
        console.error("Could not find end node with given index.");

        return true;
    } 

    var startNode = nodeList[startNodeIndex];
    var endNode = nodeList[endNodeIndex];

    var startPoint = getStartPoint(canvasCoordinateFix(new Point(startNode.x, startNode.y)), canvasCoordinateFix(new Point(endNode.x, endNode.y)));
    var endPoint = getStartPoint(canvasCoordinateFix(new Point(endNode.x, endNode.y)), canvasCoordinateFix(new Point(startNode.x, startNode.y)));

    // Drawing the line between those coordinates  
    setFillStyle("black");
    ctx.beginPath();
    ctx.moveTo(startPoint.x, 500 - startPoint.y);
    ctx.lineTo(endPoint.x, 500 - endPoint.y);
    ctx.stroke();  

    // The line was drawn, so we can add it to the edge list 
    edgeList.push({startNodeID: startNode.id, endNodeID: endNode.id});
    startNode.connections.push(endNode.id);
}

function getStartPoint(startPoint, endPoint)
{
    var desiredAngle = getDesiredAngle(startPoint, endPoint) % 360;

    // First Quadrant (0-90)
    if (desiredAngle >= 0 && desiredAngle < 90)
    {
        // "Var" creates the variable in function scope, so it'll still be accessible outside of this if statement 
        var xCoord = startPoint.x + (20 * Math.cos(desiredAngle));
        var yCoord = startPoint.y + (20 * Math.sin(desiredAngle));
    }

    // Second Quadrant (90-180)
    else if (desiredAngle >= 90 && desiredAngle < 180)
    {
        var xCoord = startPoint.x + (20 * Math.sin(desiredAngle));
        var yCoord = startPoint.y + (20 * Math.cos(desiredAngle));
    }

    // Third Quadrant (180-270)
    else if (desiredAngle >= 180 && desiredAngle < 270)
    {
        var xCoord = startPoint.x + (20 * Math.cos(desiredAngle));
        var yCoord = startPoint.y + (20 * Math.sin(desiredAngle));
    }

    // Fourth Quadrant (270-360)
    else
    {
        var xCoord = startPoint.x + (20 * Math.sin(desiredAngle));
        var yCoord = startPoint.y + (20 * Math.cos(desiredAngle));
    }
    
    return new Point(xCoord, yCoord);
}

//! NODE MANAGEMENT FUNCTIONS
function getPointNodeID(point)
{
    for (let i = 0; i < nodeList.length; i++)
    {
        if (distance(point.x, point.y, nodeList[i].x, nodeList[i].y) <= 20)
        {
            // We found a valid node, so return that node's ID 
            return nodeList[i].id;
        }
    }

    // If it looped through all the nodes and didn't find anything, return -1 to signify it wasn't able to find a node 
    return -1;
}

function makeNewNode(point)
{
    // Checking if that would make the new node overlap a current one
    for (let i = 0; i < nodeList.length; i++)
    {
        if (distance(point.x, point.y, nodeList[i].x, nodeList[i].y) <= 40)
        {
            debugOutput.textContent = "Nodes cannot visually overlap! Not creating node.";
            console.error("Nodes cannot visually overlap! Not creating node.");

            return;
        }
    }

    // Note - No aliasing should occur here because currentID is a primitive type (not an object/reference type)
    // Predeclaring node before adding to array because we use it throughout this method 
    // 15px offset is so that where they click is the middle of the square and not the top left like it normally would 
    var currentNode = new Node(point.x, point.y, currentID, []);
    nodeList.push(currentNode);

    // Iterating currentID so that the next created node has a new ID 
    currentID++;

    // Drawing the node
    setFillStyle("white");
    ctx.beginPath();
    ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    // Drawing the ID 
    setFillStyle("black");
    if (currentNode.id <= 9)
        ctx.fillText("" + currentNode.id, currentNode.x - 5, currentNode.y + 7);
    else 
        ctx.fillText("" + currentNode.id, currentNode.x - 13, currentNode.y + 7);
}

function selectNode(point)
{
    // Looking for that node in our list 
    for (let i = 0; i < nodeList.length; i++)
    {
        if (distance(point.x, point.y, nodeList[i].x, nodeList[i].y) <= 20)
        {
            // Re-drawing every node so they all appear unselected 
            for (let j = 0; j < nodeList.length; j++)
            {
                // Updates this value so when we run bfs/dfs it knows where to start at 
                currentlySelectedNodeID = j;

                // Redrawing the shape itself 
                setFillStyle("white");
                ctx.beginPath();
                ctx.arc(nodeList[j].x, nodeList[j].y, 20, 0, 2 * Math.PI);
                ctx.fill();

                // Redrawing the number
                setFillStyle("black");
                if (nodeList[i].id <= 9)
                    ctx.fillText("" + nodeList[j].id, nodeList[j].x - 5, nodeList[j].y + 7);
                else 
                    ctx.fillText("" + nodeList[j].id, nodeList[j].x - 13, nodeList[j].y + 7);
            }

            // Re-drawing over the selected node with a darker color 
            ctx.fillStyle = "rgb(150, 200, 200)";
            ctx.beginPath();
            ctx.arc(nodeList[i].x, nodeList[i].y, 20, 0, 2 * Math.PI);
            ctx.fill();

            // Drawing the number inside 
            setFillStyle("black");
            if (nodeList[i].id <= 9)
                ctx.fillText("" + nodeList[i].id, nodeList[i].x - 5, nodeList[i].y + 7);
            else 
                ctx.fillText("" + nodeList[i].id, nodeList[i].x - 13, nodeList[i].y + 7);

            // We found the node, so break out of the loop 
            break;
        }
    }
}

function deleteNode(point)
{
    for (let i = 0; i < nodeList.length; i++)
    {
        if (distance(point.x, point.y, nodeList[i].x, nodeList[i].y) <= 20)
        {
            // Drawing over that node with a gray rectangle to remove it from view
            setFillStyle("gray");
            ctx.beginPath();
            ctx.arc(nodeList[i].x, nodeList[i].y, 20, 0, 2 * Math.PI);
            ctx.fill();

            // Removing that node from the actual array 
            nodeList.splice(i, 1);

            // Because we found the correct node, break out of this loop 
            break;
        }
    }
}

//! UTILITY FUNCTIONS 
// Fixes canvas coordinates to follow the same sign conventions as the unit circle
// This function is used for trig functions, which depend on a consistent frame of reference 
function canvasCoordinateFix(topLeftPoint)
{
    return new Point(topLeftPoint.x, 500 - topLeftPoint.y);
}

function getDesiredAngle(startPoint, endPoint)
{
    var x_dot = endPoint.x - startPoint.x;
    var y_dot = endPoint.y - startPoint.y;

    // First Quadrant
    if (x_dot >= 0 && y_dot >= 0)
    {
        return Math.atan(y_dot / x_dot);
    }

    // Second Quadrant
    else if (x_dot < 0 && y_dot >= 0)
    {
        return degreeToRadian(90) + Math.atan(-x_dot / y_dot);
    }

    // Third Quadrant
    else if (x_dot < 0 && y_dot < 0)
    {
        return degreeToRadian(180) + Math.atan(-y_dot / -x_dot);
    }

    // Fourth Quadrant 
    else 
    {
        return degreeToRadian(270) + Math.atan(x_dot / -y_dot);
    }
}

function radianToDegree(radianValue)
{
    return radianValue * 180 / Math.PI;
}

function degreeToRadian(degreeValue)
{
    return degreeValue * Math.PI / 180;
}

// Distance formula 
function distance(x1, y1, x2, y2)
{
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function clearCanvas()
{
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Gotta reset the node/edge lists 
    nodeList = [];
    edgeList = [];
    currentID = 0;
}

function absoluteToCanvas(point)
{
    point.x -= (document.body.clientWidth - 500) / 2;
    point.y -= 20;

    return point;
}

// Makes code much more readable 
function setFillStyle(strInput)
{
    if (strInput.toLowerCase() === "gray" || strInput.toLowerCase() === "grey") 
    {
        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.strokeStyle = "rgb(200, 200, 200)";
    }

    else if (strInput.toLowerCase() === "black") 
    {
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.strokeStyle = "rgb(0, 0, 0)";
    }
    
    else if (strInput.toLowerCase() === "white") 
    {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.strokeStyle = "rgb(255, 255, 255)";
    }
    
    else
    {
        debugOutput.textContent = "Tried to set fill color to unsupported value.";
        console.error("Tried to set fill color to unsupported value.");
        return;
    }
}

function updateActiveButton()
{
    resetAllButtonColors();

    switch(currentMode)
    {
        case 0: 
            clearButton.style.backgroundColor = "rgb(0, 80, 190)";
            break;
        case 1: 
            newNodeButton.style.backgroundColor = "rgb(0, 80, 190)";
            break;
        case 2: 
            deleteNodeButton.style.backgroundColor = "rgb(0, 80, 190)";
            break;
        case 3: 
            nodeSelectButton.style.backgroundColor = "rgb(0, 80, 190)";
            break;
        case 4: 
            bfsButton.style.backgroundColor = "rgb(0, 80, 190)";
            break;
        case 5: 
            dfsButton.style.backgroundColor = "rgb(0, 80, 190)";
            break;
        case 6:
            drawConnectionButton.style.backgroundColor = "rgb(0, 80, 190)";
            break;
        default: 
            debugOutput.textContent = "currentMode was read as an unanticipated value.";
            console.log("currentMode was a weird value."); 
            break; 
    }
}

function resetAllButtonColors()
{
    clearButton.style.backgroundColor = "rgb(0, 120, 255)";
    newNodeButton.style.backgroundColor = "rgb(0, 120, 255)";
    deleteNodeButton.style.backgroundColor = "rgb(0, 120, 255)";
    nodeSelectButton.style.backgroundColor = "rgb(0, 120, 255)";
    bfsButton.style.backgroundColor = "rgb(0, 120, 255)";
    dfsButton.style.backgroundColor = "rgb(0, 120, 255)";
    drawConnectionButton.style.backgroundColor = "rgb(0, 120, 255)";
}