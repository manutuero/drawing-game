// The URL of your web server (the port is set in app.js)
var url = 'http://localhost:3000';

// Declared elements
const canvas = document.querySelector('#paper');
const instructions = document.querySelector('#instructions');
const context = canvas.getContext("2d");

// Generate an unique ID
const idSession = Math.round(getActualTime() * Math.random());

/* Initialize state */
// A flag for drawing activity
var isDrawing = false;
var clients = {};
var cursors = {};
var prev = {};
var lastEmit = getActualTime();

// Connecting with the app
var socket = io.connect(url);

// Adding listeners (socket inherits from EventEmitter)
socket.on('moving', function (data) {
    if (!data.id in clients) {
        // a new user has come online. create a cursor for them
        console.log('Este es el data.id: ' + data.id) // luego quitar esta linea 
        var div = document.createElement('div');
        div.class = 'cursor'
        cursors[data.id] = document.querySelector('#cursors').appendChild(div);
    }

    // Move the mouse pointer
    var divStyles = cursors[data.id].style;
    divStyles.left = data.x;
    divStyles.top = data.y;

    // Is the user drawing?
    if (data.isDrawing && clients[data.id]) {
        // Draw a line on the canvas. 
        // clients[data.id] holds the previous position of this user's mouse pointer
        drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
    }
    // Saving the current client state
    clients[data.id] = data;
    clients[data.id].updated = getActualTime();
});

canvas.on('mousedown', function(event) {
    //event.preventDefault();
    isDrawing = true;
    prev.x = event.pageX;
    prev.y = event.pageY;
    
    // Hide the instructions
    // instructions.fadeOut();
});

document.on('mouseup mouseleave', () => {
    isDrawing = false;
});

// Declaring other functions
function getActualTime() {
    return new Date().getTime();
}

const sleep = (miliseconds) => {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

// When the document on ready
document.addEventListener("DOMContentLoaded", (event) => {
    sleep(1000).then(() => {
        console.log(lastEmit);
    });
});