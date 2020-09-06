var canvasPersons = [];

var canvas = document.querySelector('canvas');

//redo this smarter
var scaleFactor = 2;

//pseudo bounding boxes/colliders
CellXSize = 24*scaleFactor;
CellYSize = 32*scaleFactor;

canvas.height = 480*scaleFactor
canvas.width = 360*scaleFactor

spawnCanvasPersons();
drawCanvasPerson()

canvas.addEventListener('click', bringPersonInformation, false);
setInterval(animateSpriteCanvasPersons, (300));
setInterval(drawCanvasPersons, (15));

function drawCanvasPersons(){
    clearScreen()
    canvasPersons.forEach(canvasPerson => {
        canvasPerson.draw()
    });
}

function clearScreen(){
    console.log("LELEELELELELELLELELELEL")
    let canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, innerWidth, innerHeight);
}

function animateCanvasPersons(){
    canvasPersons.forEach(canvasPerson => {
        canvasPerson.moveCanvasPerson()
    });
}

function animateSpriteCanvasPersons(){
    canvasPersons.forEach(canvasPerson => {
        canvasPerson.changeSprite(canvasPerson.animationFrame);
    });
}

function updatePreviousPositionValues(){
    canvasPersons.forEach(canvasPerson => {
        canvasPerson.updatePreviousVars();
    });
}

function bringPersonInformation(e) {
    mousePos = getMousePos(canvas, e);
    console.log(mousePos.x)
    console.log(mousePos.y)
    canvasPersons.forEach(canvasPerson => {
        // console.log("mousePos.x: " + mousePos.x)
        // console.log("cP.x*CXS: " + ((canvasPerson.y*CellYSize)-(canvasPerson.y*CellYSize/4)))
        // console.log("((cP.x*CXS) + CXS): " + (((canvasPerson.y*CellYSize)-(canvasPerson.y*CellYSize/4)+CellXSize)))

        // console.log("mousePos.y: " + mousePos.y)
        // console.log("cP.y*CYS: " + ((canvasPerson.x*CellXSize)+(canvasPerson.x*CellXSize/3)))//((mousePos.x*CellXSize)+(mousePos.x*CellXSize/3)))
        // console.log("((cP.y*CYS) + CYS): " + (((canvasPerson.x*CellXSize)+(canvasPerson.x*CellXSize/3))+CellYSize))

        if(mousePos.x > ((canvasPerson.y*CellYSize)-(canvasPerson.y*CellYSize/4)) && mousePos.x < ((canvasPerson.y*CellYSize)-(canvasPerson.y*CellYSize/4)+CellXSize)){
            if(mousePos.y > ((canvasPerson.x*CellXSize)+(canvasPerson.x*CellXSize/3)) && mousePos.y < (((canvasPerson.x*CellXSize)+(canvasPerson.x*CellXSize/3))+CellYSize)){
                console.log("canvasPerson id is: " + canvasPerson.id)
            }
        }
    });
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
        canvasPersons[i] = new canvasPerson(personsVar[i].y, personsVar[i].x, personsVar[i].id);
    }
}

function synchronizePersonsAndCanvasPersons(){
    for (var i = 0; i < canvasPersons.length; i++) {
        for (var e = 0; e < personsVar.length; e++) {
            if(canvasPersons[i].id == personsVar[e].id){
                canvasPersons[i].x = personsVar[e].x;
                canvasPersons[i].y = personsVar[e].y;
                canvasPersons[i].XOffset = personsVar[i].currentMovementVector[0];
                canvasPersons[i].YOffset = personsVar[i].currentMovementVector[1];
                break;
            }
        }
    }
}

function drawCanvasPerson(){
    canvasPersons.forEach(canvasPerson => {
        canvasPerson.draw();
    });
}