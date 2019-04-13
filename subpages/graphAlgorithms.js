// The canvas that will display everything that's actually processed here in the code 
var canvas = document.getElementById("canvas");
var canvasWidth = document.body.clientWidth, canvasHeight = canvas.height;

// Controls drawing on the canvas itself 
var ctx = canvas.getContext("2d");

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
    clickCoordinates = new Point(event.x, event.y);
    updateCanvasSizing();

    // Checks if the click was inside the canvas 
    // Todo - Figure out how to make this not a hardcoded value, though theoretically a hardcoded value scales appropriately 
    if (clickCoordinates.x > 20 && clickCoordinates.x < (document.body.clientWidth - 500) / 2 + canvasWidth && 
        clickCoordinates.y > 20 && clickCoordinates.y < 20 + canvasHeight)
    {
        switch(currentMode)
        {
            // Clear Screen
            case 0: 
                break; // Do nothing, as all behavior is controlled in the button's onClickListener 
            
            // New Node
            case 1: 
                makeNewNode(absoluteToCanvas(new Point(clickCoordinates.x, clickCoordinates.y)));
                break;

            // Delete Node
            case 2: 
                break;

            // Select Node
            case 3: 
                break;

            // Run BFS on Selected Node
            case 4: 
                break;

            // Run DFS on Selected Node
            case 5: 
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
}

function updateCanvasSizing()
{
    canvasWidth = canvas.offsetWidth;
    canvasHeight = canvas.offsetHeight;
}

// The canvas is just straight-up a 20, 20 offset from the top left of the page, which makes this much easier
function absoluteToCanvas(point)
{
    console.log("absoluteToCanvas input: ");
    console.log("point.x: " + point.x);
    console.log("point.y: " + point.y);

    console.log("Client Width: " + document.body.clientWidth);
    console.log("Pixels to the LEft: " + (document.body.clientWidth - 500) / 2);

    point.x -= (document.body.clientWidth - 500) / 2;
    point.y -= 20;

    console.log("absolutetoCanvas return: ");
    console.log(point);

    return point;
}

function makeNewNode(point)
{
    ctx.fillRect(5, 5, 20, 20);
    console.log("Making a white square at canvas coordinates x = " + point.x + ", y = " + point.y);
    // Adds it on as the new last element and makes it have zero connections
    nodeList.push(new Node(point.x, point.y, nodeList.length, []));

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.strokeStyle = "rgb(0, 0, 0)";

    console.log("Filling Rectangle at canvas x = " + (point.x - 10) + ", y = " + (point.y - 10));
    ctx.fillRect(point.x - 10, point.y - 10, 20, 20);
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



