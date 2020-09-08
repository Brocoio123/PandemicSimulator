var canvasPersons = [];

var canvas = document.getElementById('mainCanvas');
var canvasContext = canvas.getContext('2d');

var hud1 = document.getElementById('hud1');
var hud1Context = hud1.getContext('2d');

//redo this smarter
var scaleFactor = 2;

//pseudo bounding boxes/colliders
CellXSize = 24*scaleFactor;
CellYSize = 32*scaleFactor;

canvas.height = 480*scaleFactor
canvas.width = 360*scaleFactor

hud1.height = 80 * scaleFactor
hud1.width = 160 * scaleFactor
hud1Context.font = "20px Arial";

spawnCanvasPersons();
drawCanvasPerson()

canvas.addEventListener('click', displayPersonInformation, false);
setInterval(animateSpriteCanvasPersons, (300));
setInterval(drawCanvasPersons, ((turnInterval/65)-((turnInterval/65)*0.25)));

function drawCanvasPersons(){
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasPersons.forEach(canvasPerson => {
        canvasPerson.draw()
    });
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

function getPersonInformation(id){
    var obj;
    personsVar.forEach(person => {
        if(person.id == id){
            //console.log(person)
            obj = {
                id: person.id,
                spriteId: person.spriteId,
                name:person.name,
                gender:person.name,
                status:person.status
              }
        }   
    });
    return(obj);
    //console.log(obj)
}

function displayPersonInformation(e) {
    mousePos = getMousePos(canvas, e);
    console.log(mousePos.x)
    console.log(mousePos.y)
    canvasPersons.forEach(canvasPerson => {
        if(mousePos.x > ((canvasPerson.y*CellYSize)-(canvasPerson.y*CellYSize/4)) && mousePos.x < ((canvasPerson.y*CellYSize)-(canvasPerson.y*CellYSize/4)+CellXSize)){
            if(mousePos.y > ((canvasPerson.x*CellXSize)+(canvasPerson.x*CellXSize/3)) && mousePos.y < (((canvasPerson.x*CellXSize)+(canvasPerson.x*CellXSize/3))+CellYSize)){
                var information = {}
                information = getPersonInformation(canvasPerson.id)
                hud1Context.clearRect(0, 0, hud1.width, hud1.height);
                hud1Context.fillText("name: " + information.name, (hud1.width*0.1), (hud1.height*0.3));
                hud1Context.fillText("gender: " + information.gender, (hud1.width*0.1), (hud1.height*0.6));
                hud1Context.fillText("Status: " + information.status, (hud1.width*0.1), (hud1.height*0.9));
                console.log("canvasPerson id is: " + canvasPerson.id)
                return;
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
        canvasPersons[i] = new canvasPerson(personsVar[i].y, personsVar[i].x, personsVar[i].id, personsVar[i].spriteId);
        console.log(personsVar[i].spriteId)
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