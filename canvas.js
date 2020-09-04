var canvasPersons = [];

var canvas = document.querySelector('canvas');

//redo this smarter
var scaleFactor = 2;

CellXSize = 24*scaleFactor;
CellYSize = 32*scaleFactor;

canvas.height = 480*scaleFactor
canvas.width = 360*scaleFactor


console.log(canvas.width)
console.log(canvas.height)

spawnCanvasPersons();
drawCanvasPerson()

canvas.addEventListener('click', bringPersonInformation, false);

function bringPersonInformation(e) {
    mousePos = getMousePos(canvas, e);
    console.log(mousePos.x)
    console.log(mousePos.y)
    // canvasPersons.forEach(canvasPerson => {
    //     if(canvasPerson.)
    // });
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function spawnCanvasPersons(){
        for (var i = 0; i < personsVar.length; i++) { 
        // var randX = Math.floor(Math.random() * (screenX));
        // var randY = Math.floor(Math.random() * (screenY));
        // while(world[randY][randX] == "T" || world[randY][randX] == "P"){
        //     randX = Math.floor(Math.random() * (screenX));
        //     randY = Math.floor(Math.random() * (screenY));
        // }
        // console.log(this.randX)
        // console.log(this.randY)

        canvasPersons[i] = new canvasPerson(personsVar[i].y, personsVar[i].x, i);
    }
}

function drawCanvasPerson(){
    canvasPersons.forEach(canvasPerson => {
        canvasPerson.draw();
    });
}