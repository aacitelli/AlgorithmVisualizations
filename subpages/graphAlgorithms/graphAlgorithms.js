/* Overall Todo: 

    - Split this up into more files. I'd like to keep the file structure pretty organized because 
        this'll be a pretty big website when I'm done, but too much JS in one file really hurts
        the code in terms of readability, which is always a focus for me. 
    - Make each "node" a circle instead of a square (which makes collision a little harder but
        makes the page look a lot better IMHO). Collision just switches to distance formula, 
        basically.

*/

// The canvas that will display everything that's actually processed here in the code 
var canvas = document.getElementById("canvas");
var canvasWidth = 500, canvasHeight = 500;

// Controls drawing on the canvas itself 
var ctx = canvas.getContext("2d");
ctx.font = "16pt Arial";

// Used to show at the end what order the algorithm went in 
var visitOrder = document.getElementById("visitOrder");

// Buttons are used a lot so they're defined globally 
var clearButton = document.getElementById("clearButton");
var newNodeButton = document.getElementById("newNodeButton");
var deleteNodeButton = document.getElementById("deleteNodeButton");
var nodeSelectButton = document.getElementById("nodeSelectButton");
var bfsButton = document.getElementById("bfsButton");
var dfsButton = document.getElementById("dfsButton");
var drawConnectionButton = document.getElementById("drawConnectionButton");

/*
    0 => Clear Grid 
    1 => New Node 
    2 => Delete Node 
    3 => Select Node 
    4 => Run DFS on Selected Node 
    5 => Run DFS on Selected Node
    6 => Draw connections between nodes
*/
var currentMode = 0;

// "Node" Definition
// Todo - Make the nodes automatically readjust so that you don't have to give them a x,y coordinate
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

// Holds currently taken ID numbers
var nodeList = [];

document.addEventListener("click", function(event)
{
    // These are absolute click coordinates
    clickCoordinates = new Point(event.x, event.y);

    // Checks if the click was inside the canvas 
    // Todo - Figure out how to make this not a hardcoded value, though theoretically a hardcoded value scales appropriately 
    if (clickCoordinates.x > (document.body.clientWidth - 500) / 2 && clickCoordinates.x < (document.body.clientWidth - 500) / 2 + canvasWidth && 
        clickCoordinates.y > 20 && clickCoordinates.y < 20 + canvasHeight)
    {
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

            case 6: 
                break;

            // Error checking 
            default:
            {
                console.error("currentMode was set to a value it really shouldn't be able to be set to.");
            }
        }
    }
});

// Point object to simplify the entire structure of this program 
function Point(x, y)
{
    this.x = x;
    this.y = y;
}

function clearCanvas()
{
    updateCanvasSizing();
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Gotta reset the node list 
    nodeList = [];
}

function updateCanvasSizing()
{
    canvasWidth = canvas.offsetWidth;
    canvasHeight = canvas.offsetHeight;
}

// The canvas is just straight-up a 20, 20 offset from the top left of the page, which makes this much easier
function absoluteToCanvas(point)
{
    point.x -= (document.body.clientWidth - 500) / 2;
    point.y -= 20;

    return point;
}

function makeNewNode(point)
{
    // Predeclaring node before adding to array because we use it throughout this method 
    var currentNode = new Node(point.x - 15, point.y - 15, nodeList.length, []);
    nodeList.push(currentNode);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.strokeStyle = "rgb(0, 0, 0)";

    // Drawing the shape itself
    ctx.fillRect(point.x - 15, point.y - 15, 30, 30);

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.strokeStyle = "rgb(255, 255, 255)";

    // * Drawing the ID 
    if (currentNode.id <= 9)
        ctx.fillText("" + currentNode.id, currentNode.x + 9, currentNode.y + 22);
    else 
        ctx.fillText("" + currentNode.id, currentNode.x + 2, currentNode.y + 22);
}

function selectNode(point)
{
    // Looking for that node in our list 
    for (let i = 0; i < nodeList.length; i++)
    {
        if (point.x - nodeList[i].x < 30 && point.y - nodeList[i].y < 30)
        {
            // Re-drawing every node so they all appear unselected 
            for (let j = 0; j < nodeList.length; j++)
            {
                // Redrawing the shape itself 
                ctx.fillStyle = "rgb(255, 255, 255)";
                ctx.fillRect(nodeList[j].x, nodeList[j].y, 30, 30);

                // Redrawing the number
                ctx.fillStyle="rgb(0, 0, 0)";
                if (nodeList[j].id <= 9)
                    ctx.fillText("" + nodeList[j].id, nodeList[j].x + 9, nodeList[j].y + 22);
                else 
                    ctx.fillText("" + nodeList[j].id, nodeList[j].x + 2, nodeList[j].y + 22);
            }

            // Re-drawing over the selected node with a darker color 
            ctx.fillStyle = "rgb(150, 200, 200)";
            ctx.fillRect(nodeList[i].x, nodeList[i].y, 30, 30);

            // Drawing the number inside 
            ctx.fillStyle="rgb(0, 0, 0)";
            if (nodeList[i].id <= 9)
                ctx.fillText("" + nodeList[i].id, nodeList[i].x + 9, nodeList[i].y + 22);
            else 
                ctx.fillText("" + nodeList[i].id, nodeList[i].x + 2, nodeList[i].y + 22);

            // We found the node, so break out of the loop 
            break;
        }
    }
}

function deleteNode(point)
{
    for (let i = 0; i < nodeList.length; i++)
    {
        if (point.x - nodeList[i].x < 30 && point.x - nodeList[i].x >= 0 &&
            point.y - nodeList[i].y < 30 && point.y - nodeList[i].y >= 0)
        {
            // Drawing over that node with a gray rectangle to remove it from view
            ctx.fillStyle = "rgb(200, 200, 200)";
            ctx.fillRect(nodeList[i].x, nodeList[i].y, 30, 30);

            // Removing that node from the actual array 
            console.log("Pre-Splice nodeList: ");
            console.log(nodeList);
            nodeList.splice(i, 1);
            console.log("Post-Splice nodeList: ");
            console.log(nodeList);

            // Because we found the correct node, break out of this loop 
            break;
        }
    }
}

// * Button Graphical Utilities
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

// * Button Event Listeners
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
})



