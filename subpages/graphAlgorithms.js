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

/*
    0 => Clear Grid 
    1 => New Node 
    2 => Delete Node 
    3 => Select Node 
    4 => Run DFS on Selected Node 
    5 => Run DFS on Selected Node
*/
var currentMode = 0;

document.addEventListener("click", function(event)
{
    clickCoordinates = new Point(event.x, event.y);
    updateCanvasSizing();

    // Checks if the click was inside the canvas 
    // Todo - Figure out how to make this not a hardcoded value, though theoretically a hardcoded value scales appropriately 
    if (clickCoordinates.x > 20 && clickCoordinates.x < 20 + canvasWidth && 
        clickCoordinates.y > 20 && clickCoordinates.y < 20 + canvasHeight)
    {
        console.log("Click is inside canvas.");

        switch(currentMode)
        {
            // Clear Grid
            case 0:
                console.log(ctx);
                break;

            // New Node
            case 1: 
                clearCanvas();
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

    else 
    {
        console.log("Click is outside canvas.");
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
function convertAbsoluteCoordsToCanvasCoords(point)
{
    return new Point(point.x - 20, point.y - 20);
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
}

/* ------------------------------------------

            EVENT LISTENERS

-------------------------------------------*/
document.getElementById("clearButton").addEventListener("click", function()
{
    currentMode = 0;
    clearCanvas():
    updateActiveButton();
});

document.getElementById("newNodeButton").addEventListener("click", function()
{
    currentMode = 1;
    updateActiveButton();
});

document.getElementById("deleteNodeButton").addEventListener("click", function()
{
    currentMode = 2;
    updateActiveButton();
});

document.getElementById("nodeSelectButton").addEventListener("click", function()
{
    currentMode = 3;
    updateActiveButton();
});

document.getElementById("bfsButton").addEventListener("click", function()
{
    currentMode = 4;
    updateActiveButton();
});

document.getElementById("dfsButton").addEventListener("click", function()
{
    currentMode = 5;
    updateActiveButton();
});

