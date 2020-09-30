var cachedImages = [new Image, new Image, new Image, new Image, new Image, new Image];
var canvasPersons = [];

var canvas = document.getElementById('mainCanvas');
var canvasContext = canvas.getContext('2d');

var hud1 = document.getElementById('hud1');
var hud1Context = hud1.getContext('2d');

var hud2 = document.getElementById('hud2');
var hud2Context = hud2.getContext('2d');

//redo this smarter
var scaleFactor = 2;

//pseudo bounding boxes/colliders
CellXSize = 24*scaleFactor;
CellYSize = 32*scaleFactor;

canvas.height = 480*scaleFactor;
canvas.width = 360*scaleFactor;

hud1.height = 80 * scaleFactor;
hud1.width = 160 * scaleFactor;
hud1Context.font = "20px Arial";
hud1Context.imageSmoothingEnabled = false;

hud2.height = 280 * scaleFactor;
hud2.width = 160 * scaleFactor;
hud2Context.font = "20px Arial";

cacheHudImages()
spawnCanvasPersons();
drawCanvasPerson();

canvas.addEventListener('click', displayPersonInformation, false);
setInterval(animateSpriteCanvasPersons, (300));
setInterval(drawCanvasPersons, ((turnInterval/65)-((turnInterval/65)*0.25)));
//associate this setinterval to a variable on a function, use jquery onchange to destroy and recreate
//this setinterval dynamically when slider is touched


function cacheHudImages(){
    for (var i = 0, len = cachedImages.length; i < len; i++) {
        cachedImages[i].src = 'http://127.0.0.1/PandemicSimulator/sprites/chara'+ i +'Down0.png';
    }
}

function drawCanvasPersons(){
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasPersons.forEach(canvasPerson => {
        canvasPerson.draw();
    });
}

function animateCanvasPersons(){
    canvasPersons.forEach(canvasPerson => {
        canvasPerson.moveCanvasPerson();
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
    let obj;
    personsVar.forEach(person => {
        if(person.id == id){
            obj = {
                id: person.id,
                spriteId: person.spriteId,
                name: person.name,
                status: person.status,
                panicIndex: person.PI,
                cautionIndex: person.CI,
                infectionChance: person.IC
              };
        }
    });
    return(obj);
}

displayWorldInformation()
function displayWorldInformation() {
    hud2Context.clearRect(0, 0, hud2.width, hud2.height);
    hud2Context.fillText("Global virus threat level: " + GVTL, (hud2.width*0.05), (hud2.height*0.1));
    hud2Context.fillText("Population: " + population, (hud2.width*0.05), (hud2.height*0.15));
    hud2Context.fillText("Number of stage 1 infected: " + numberOfStage1Infected, (hud2.width*0.05), (hud2.height*0.2));
    hud2Context.fillText("Number of stage 2 infected: " + numberOfStage2Infected, (hud2.width*0.05), (hud2.height*0.25));
    hud2Context.fillText("Number of stage 3 infected: " + numberOfStage3Infected, (hud2.width*0.05), (hud2.height*0.3));
    hud2Context.fillText("Number of healthy " + numberOfHealthy, (hud2.width*0.05), (hud2.height*0.35));
    hud2Context.fillText("Number of recovered " + numberOfRecovered, (hud2.width*0.05), (hud2.height*0.4));
    hud2Context.fillText("Number of dead " + numberOfDead, (hud2.width*0.05), (hud2.height*0.45));
    //botar infected on the day before
    hud2Context.fillText("Time: " + hours%24 + ":00", (hud2.width*0.05), (hud2.height*0.5));
    //only shows infected in the current screen
    hud2Context.fillText("Infections on screen: " + infectedInOneDay, (hud2.width*0.05), (hud2.height*0.55));
    hud2Context.fillText("Total infected the yesterday: " + infectedThePreviousDay, (hud2.width*0.05), (hud2.height*0.6));
    return;
}

function displayPersonInformation(e) {
    mousePos = getMousePos(canvas, e);
    console.log(mousePos.x);
    console.log(mousePos.y);
    let information = {};
    let img = new Image;
    canvasPersons.forEach(canvasPerson => {
        if(mousePos.x > ((canvasPerson.y*CellYSize)-(canvasPerson.y*CellYSize/4)) && mousePos.x < ((canvasPerson.y*CellYSize)-(canvasPerson.y*CellYSize/4)+CellXSize)){
            if(mousePos.y > ((canvasPerson.x*CellXSize)+(canvasPerson.x*CellXSize/3)) && mousePos.y < (((canvasPerson.x*CellXSize)+(canvasPerson.x*CellXSize/3))+CellYSize)){
                hud1Context.font = "20px Arial";
                img.src = 'http://127.0.0.1/PandemicSimulator/sprites/chara'+ canvasPerson.spriteId +'Down0.png';
                console.log(img.src)
                information = getPersonInformation(canvasPerson.id);
                hud1Context.clearRect(0, 0, hud1.width, hud1.height);
                hud1Context.fillText("name: " + information.name, (hud1.width*0.25), (hud1.height*0.18));
                hud1Context.fillText("Status: " + information.status, (hud1.width*0.25), (hud1.height*0.36));
                hud1Context.fillText("Panic: " + information.panicIndex.toFixed(2) + "%", (hud1.width*0.25), (hud1.height*0.54));
                hud1Context.fillText("Caution: " + information.cautionIndex.toFixed(2) + "%", (hud1.width*0.25), (hud1.height*0.72));
                hud1Context.fillText("Infection chance: " + information.infectionChance.toFixed(2) + "%", (hud1.width*0.25), (hud1.height*0.90));
                hud1Context.drawImage(img, (hud1.width*0.05), (hud1.height*0.2), CellXSize,  CellYSize);
                hud1Context.font = "10px Arial";
                for (let i = 0, len = personsVar[canvasPerson.id].preventionMeasures.length; i < len; i++) {
                    console.log(personsVar[canvasPerson.id].preventionMeasures[i])
                    hud1Context.fillText(personsVar[canvasPerson.id].preventionMeasures[i], (hud1.width*0.01), ((hud1.height*0.7)+(i*10)));

                }
                return;
            }
        }
    });
}

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function spawnCanvasPersons(){
        for (let i = 0; i < personsVar.length; i++) { 
        canvasPersons[i] = new canvasPerson(personsVar[i].y, personsVar[i].x, personsVar[i].id, personsVar[i].spriteId);
        console.log(personsVar[i].spriteId);
    }
}

function synchronizePersonsAndCanvasPersons(){
    for (let i = 0; i < canvasPersons.length; i++) {
        for (let e = 0; e < personsVar.length; e++) {
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